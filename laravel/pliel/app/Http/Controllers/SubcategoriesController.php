<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SubcategoriesController extends Controller
{
    /**
     * Muestra la subcategoría con las traducciones asociadas.
     *
     * @param int $id El ID de la subcategoría.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $subcat = Subcategory::with('translations')->find($id);
        return response()->json($subcat);
    }

    /**
     * Muestra las traducciones de una subcategoría específica.
     *
     * @param int $id El ID de la subcategoría.
     * @return \Illuminate\Http\JsonResponse
     */
    public function showTranslations($id)
    {
        $book = Subcategory::find($id);

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
     * Crea una nueva subcategoría y sus traducciones.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
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
            $keyName = 'subcat_name ' . $slug;
            $keyDescription = 'subcat_desc ' . $slug;

            $subcatData = [
                'category_id' => $request->input('category_id'),
                'key_name' => $keyName,
                'key_description' => $keyDescription
            ];

            // Crear la subcategoría
            $subcat = Subcategory::create($subcatData);

            // Actualizar traducciones
            $this->updateTranslations($request, $subcat);

            DB::commit();

            return response()->json(['message' => 'Subcategory created successfully', 'subcategory' => $subcat], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Subcategory creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza una subcategoría existente y sus traducciones.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP.
     * @param int $id El ID de la subcategoría.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $subcat = Subcategory::find($id);
        if (!$subcat) {
            return response()->json(['error' => 'Subcategory not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
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
            $subcatData = $request->only([
                'category_id', 'name_es', 'desc_es', 'name_en', 'desc_en'
            ]);
            if ($request->has('name_es')) {
                // Borra las traducciones anteriores
                Translation::where('key', $subcat->key_name)->delete();
                Translation::where('key', $subcat->key_description)->delete();
                // Actualiza el slug y la clave de traducción
                $nameEs = $request->input('name_es');
                $slug = Str::slug($nameEs, '_');
                $subcatData['key_name'] = 'subcat_name ' . $slug;
                $subcatData['key_description'] = 'subcat_desc ' . $slug;
            }

            $subcat->update($subcatData);
            $subcat->updated_at = now();

            $this->updateTranslations($request, $subcat);

            DB::commit();

            return response()->json(['message' => 'Subcategory updated successfully', 'subcategory' => $subcat]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Subcategory update failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza las traducciones de una subcategoría.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP.
     * @param \App\Models\Subcategory $subcat La subcategoría a actualizar.
     * @return void
     */
    private function updateTranslations(Request $request, Subcategory $subcat)
    {
        $languages = ['es', 'en'];
        foreach ($languages as $language) {
            if ($request->has("name_{$language}") && $request->has("desc_{$language}")) {
                Translation::updateOrCreate(
                    ['key' => $subcat->key_name, 'language' => $language],
                    ['translation' => $request->input("name_{$language}")]
                );
                Translation::updateOrCreate(
                    ['key' => $subcat->key_description, 'language' => $language],
                    ['translation' => $request->input("desc_{$language}")]
                );
            }
        }
    }

    /**
     * Elimina una subcategoría y sus traducciones.
     *
     * @param int $id El ID de la subcategoría.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $subcat = Subcategory::find($id);
        if (!$subcat) {
            return response()->json(['error' => 'Subcategory not found'], 404);
        }

        DB::beginTransaction();

        try {
            $subcat->delete();

            // Borrar traducciones también
            Translation::where('key', $subcat->key_name)->delete();
            Translation::where('key', $subcat->key_description)->delete();

            DB::commit();

            return response()->json(['message' => 'Subcategory deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Subcategory deletion failed', 'error' => $e->getMessage()], 500);
        }
    }
}
