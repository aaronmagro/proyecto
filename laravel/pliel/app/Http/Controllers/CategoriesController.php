<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoriesController extends Controller
{
    /**
     * Muestra los detalles de una categoría específica, incluyendo sus traducciones.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $cat = Category::with('translations')->find($id);
        return response()->json($cat);
    }

    /**
     * Muestra las traducciones de una categoría específica en español e inglés.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showTranslations($id)
    {
        $book = Category::find($id);

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $translations = Translation::getTranslation($book->key_name, 'es');
        $translations2 = Translation::getTranslation($book->key_description, 'es');
        $translations3 = Translation::getTranslation($book->key_name, 'en');
        $translations4 = Translation::getTranslation($book->key_description, 'en');

        $translations = [
            'name_es' => $translations->translation,
            'desc_es' => $translations2->translation,
            'name_en' => $translations3->translation,
            'desc_en' => $translations4->translation
        ];

        return response()->json($translations);
    }

    /**
     * Crea una nueva categoría y sus traducciones correspondientes.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_es' => 'required|string|max:255',
            'desc_es' => 'required|string',
            'name_en' => 'required|string|max:255',
            'desc_en' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $nameEs = $request->input('name_es');
            $slug = Str::slug($nameEs, '_');
            $keyName = 'cat_name ' . $slug;
            $keyDescription = 'cat_desc ' . $slug;

            $catData['key_name'] = $keyName;
            $catData['key_description'] = $keyDescription;

            // Crear la categoría
            $cat = Category::create($catData);

            // Actualizar traducciones
            $this->updateTranslations($request, $cat);

            DB::commit();

            return response()->json(['message' => 'Category created successfully', 'category' => $cat], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Category creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza una categoría específica y sus traducciones.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name_es' => 'required|string|max:255',
            'desc_es' => 'required|string',
            'name_en' => 'required|string|max:255',
            'desc_en' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $catData = $request->only([
                'name_es', 'desc_es', 'name_en', 'desc_en'
            ]);
            if ($request->has('name_es')) {
                // Borra las traducciones anteriores
                Translation::where('key', $cat->key_name)->delete();
                Translation::where('key', $cat->key_description)->delete();
                // Actualiza el slug y la clave de traducción
                $nameEs = $request->input('name_es');
                $slug = Str::slug($nameEs, '_');
                $catData['key_name'] = 'cat_name ' . $slug;
                $catData['key_description'] = 'cat_desc ' . $slug;
            }

            $cat->update($catData);
            $cat->updated_at = now();

            $this->updateTranslations($request, $cat);

            DB::commit();

            return response()->json(['message' => 'Category updated successfully', 'book' => $cat]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Category update failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza las traducciones de una categoría.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Category $cat
     */
    private function updateTranslations(Request $request, Category $cat)
    {
        $languages = ['es', 'en'];
        foreach ($languages as $language) {
            if ($request->has("name_{$language}") && $request->has("desc_{$language}")) {
                Translation::updateOrCreate(
                    ['key' => $cat->key_name, 'language' => $language],
                    ['translation' => $request->input("name_{$language}")]
                );
                Translation::updateOrCreate(
                    ['key' => $cat->key_description, 'language' => $language],
                    ['translation' => $request->input("desc_{$language}")]
                );
            }
        }
    }

    /**
     * Elimina una categoría específica y sus traducciones.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        DB::beginTransaction();

        try {
            $cat->delete();

            // Borrar traducciones también
            Translation::where('key', $cat->key_name)->delete();
            Translation::where('key', $cat->key_description)->delete();

            DB::commit();

            return response()->json(['message' => 'Category deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Category deletion failed', 'error' => $e->getMessage()], 500);
        }
    }

}
