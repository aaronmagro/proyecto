<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BooksController extends Controller
{
    /**
     * Muestra los detalles de un libro específico, incluyendo sus traducciones.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $translations = Translation::getTranslation($book->key_title, 'es');
        $translations2 = Translation::getTranslation($book->key_description, 'es');
        $translations3 = Translation::getTranslation($book->key_title, 'en');
        $translations4 = Translation::getTranslation($book->key_description, 'en');

        $translations = [
            'title_es' => $translations->translation,
            'desc_es' => $translations2->translation,
            'title_en' => $translations3->translation,
            'desc_en' => $translations4->translation
        ];

        return response()->json([
            'id' => $book->id,
            'isbn' => $book->isbn,
            'publisher' => $book->publisher,
            'language' => $book->language,
            'author' => $book->author,
            'price' => $book->price,
            'image' => $book->image,
            'subcategory_id' => $book->subcategory_id,
            'average_rating' => $book->average_rating,
            'rating_count' => $book->rating_count,
            'comments_count' => $book->comments_count,
            'created_at' => $book->created_at,
            'updated_at' => $book->updated_at,
            'translations' => $translations
        ]);
    }

    /**
     * Muestra las traducciones de un libro específico en español e inglés.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showTranslations($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $translations = Translation::getTranslation($book->key_title, 'es');
        $translations2 = Translation::getTranslation($book->key_description, 'es');
        $translations3 = Translation::getTranslation($book->key_title, 'en');
        $translations4 = Translation::getTranslation($book->key_description, 'en');

        $translations = [
            'title_es' => $translations->translation,
            'desc_es' => $translations2->translation,
            'title_en' => $translations3->translation,
            'desc_en' => $translations4->translation
        ];

        return response()->json($translations);
    }

    /**
     * Crea un nuevo libro y sus traducciones correspondientes.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'isbn' => 'required|string|unique:books,isbn',
            'author' => 'required|string|max:255',
            'price' => 'required|numeric',
            'publisher' => 'required|string|max:255',
            'language' => 'required|string|max:2',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image_url' => 'nullable|url',
            'subcategory_id' => 'required|integer|exists:subcategories,id',
            'title_es' => 'required|string|max:255',
            'desc_es' => 'required|string',
            'title_en' => 'required|string|max:255',
            'desc_en' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $titleEs = $request->input('title_es');
            $slug = Str::slug($titleEs, '_');
            $keyTitle = 'book_title ' . $slug;
            $keyDescription = 'book_desc ' . $slug;

            $bookData = $request->only([
                'isbn', 'author', 'price', 'publisher', 'language', 'subcategory_id'
            ]);

            $bookData['key_title'] = $keyTitle;
            $bookData['key_description'] = $keyDescription;
            $bookData['average_rating'] = 0;
            $bookData['rating_count'] = 0;
            $bookData['comments_count'] = 0;

            if ($request->hasFile('image')) {
                // Verificar si el directorio existe, si no, crearlo
                if (!Storage::exists('public/images')) {
                    Storage::makeDirectory('public/images');
                }

                // Guardar la nueva imagen
                $file = $request->file('image');
                $filename = Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/images', $filename);

                // Actualizar el campo image del libro con la ruta del archivo
                $bookData['image'] = 'images/' . $filename; // Guardar solo la parte relativa
            } elseif ($request->image_url) {
                // Si se proporciona una URL externa para la imagen
                $bookData['image'] = $request->image_url;
            }

            // Crear el libro
            $book = Book::create($bookData);

            // Actualizar traducciones
            $this->updateTranslations($request, $book);

            DB::commit();

            return response()->json(['message' => 'Book created successfully', 'book' => $book], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Book creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza un libro específico y sus traducciones.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'isbn' => 'required|string|unique:books,isbn,' . $book->id,
            'author' => 'required|string|max:255',
            'price' => 'required|numeric',
            'publisher' => 'required|string|max:255',
            'language' => 'required|string|max:2',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|url',
            'subcategory_id' => 'required|integer|exists:subcategories,id',
            'title_es' => 'required|string|max:255',
            'desc_es' => 'required|string',
            'title_en' => 'required|string|max:255',
            'desc_en' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $bookData = $request->only([
                'isbn', 'author', 'price', 'publisher', 'language', 'subcategory_id'
            ]);

            if ($request->hasFile('image')) {
                if (!Storage::exists('public/images')) {
                    Storage::makeDirectory('public/images');
                }

                // Borrar la imagen anterior si no es una URL externa
                if ($book->image && !preg_match('/^(http|https):\/\//', $book->image)) {
                    Storage::delete($book->image);
                }

                // Guardar la nueva imagen
                $file = $request->file('image');
                $filename = Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/images', $filename);

                // Actualizar el campo image del libro con la ruta del archivo
                $bookData['image'] = 'images/' . $filename; // Guardar solo la parte relativa
            } elseif ($request->image_url) {
                $bookData['image'] = $request->image_url;
            }

            if ($request->has('title_es')) {
                // Borra las traducciones anteriores
                Translation::where('key', $book->key_title)->delete();
                Translation::where('key', $book->key_description)->delete();
                // Actualiza el slug y la clave de traducción
                $titleEs = $request->input('title_es');
                $slug = Str::slug($titleEs, '_');
                $bookData['key_title'] = 'book_title ' . $slug;
                $bookData['key_description'] = 'book_desc ' . $slug;
            }

            $book->update($bookData);
            $book->updated_at = now();

            $this->updateTranslations($request, $book);

            DB::commit();

            return response()->json(['message' => 'Book updated successfully', 'book' => $book]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Book update failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza las traducciones de un libro.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Book $book
     */
    private function updateTranslations(Request $request, Book $book)
    {
        $languages = ['es', 'en'];
        foreach ($languages as $language) {
            if ($request->has("title_{$language}") && $request->has("desc_{$language}")) {
                Translation::updateOrCreate(
                    ['key' => $book->key_title, 'language' => $language],
                    ['translation' => $request->input("title_{$language}")]
                );
                Translation::updateOrCreate(
                    ['key' => $book->key_description, 'language' => $language],
                    ['translation' => $request->input("desc_{$language}")]
                );
            }
        }
    }

    /**
     * Elimina un libro específico y sus traducciones.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        DB::beginTransaction();

        try {
            if ($book->image && !preg_match('/^(http|https):\/\//', $book->image)) {
                Storage::delete($book->image);
            }

            $book->delete();

            // Borrar traducciones también
            Translation::where('key', $book->key_title)->delete();
            Translation::where('key', $book->key_description)->delete();

            DB::commit();

            return response()->json(['message' => 'Book deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Book deletion failed', 'error' => $e->getMessage()], 500);
        }
    }
}
