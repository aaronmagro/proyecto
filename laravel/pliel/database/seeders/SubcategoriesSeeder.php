<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Subcategory;
use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubcategoriesSeeder extends Seeder
{
    /**
     * Ejecuta los seeders.
     */
    public function run(): void
    {
        // Seeder para subcategorias

        // Seleccionar el category_id de la categoría a la que pertenece la subcategoría segun el nombre de la categoría (primera palabra despues de subcat_name)
        // Ejemplo: subcat_name fantasia_epica -> cat_name fantasia
        // Ejemplo: subcat_name fantasia_infantil -> cat_name fantasia
        // Pues de eso, coger where cat_name starts with 'fantasia' y coger el id de esa categoría

        $subcategories = [
            ['key_name' => 'subcat_name fantasia_epica', 'key_description' => 'subcat_desc fantasia_epica'],
            ['key_name' => 'subcat_name fantasia_infantil', 'key_description' => 'subcat_desc fantasia_infantil'],
            ['key_name' => 'subcat_name fantasia_heroica', 'key_description' => 'subcat_desc fantasia_heroica'],
            ['key_name' => 'subcat_name fantasia_juvenil', 'key_description' => 'subcat_desc fantasia_juvenil'],
            ['key_name' => 'subcat_name fantasia_urbana', 'key_description' => 'subcat_desc fantasia_urbana'],
            ['key_name' => 'subcat_name fantasia_historica', 'key_description' => 'subcat_desc fantasia_historica'],
            ['key_name' => 'subcat_name fantasia_romantica', 'key_description' => 'subcat_desc fantasia_romantica'],
            ['key_name' => 'subcat_name fantasia_ciencia_ficcion', 'key_description' => 'subcat_desc fantasia_ciencia_ficcion'],
            ['key_name' => 'subcat_name clasicos_griegos', 'key_description' => 'subcat_desc clasicos_griegos'],
            ['key_name' => 'subcat_name clasicos_latinos', 'key_description' => 'subcat_desc clasicos_latinos'],
            ['key_name' => 'subcat_name clasicos_ingleses', 'key_description' => 'subcat_desc clasicos_ingleses'],
            ['key_name' => 'subcat_name clasicos_espanoles', 'key_description' => 'subcat_desc clasicos_espanoles'],
            ['key_name' => 'subcat_name clasicos_rusos', 'key_description' => 'subcat_desc clasicos_rusos'],
            ['key_name' => 'subcat_name clasicos_franceses', 'key_description' => 'subcat_desc clasicos_franceses'],
            ['key_name' => 'subcat_name clasicos_alemanes', 'key_description' => 'subcat_desc clasicos_alemanes'],
            ['key_name' => 'subcat_name clasicos_portugueses', 'key_description' => 'subcat_desc clasicos_portugueses'],
            ['key_name' => 'subcat_name clasicos_italianos', 'key_description' => 'subcat_desc clasicos_italianos'],
            ['key_name' => 'subcat_name clasicos_chinos', 'key_description' => 'subcat_desc clasicos_chinos'],
            ['key_name' => 'subcat_name clasicos_japoneses', 'key_description' => 'subcat_desc clasicos_japoneses'],
            ['key_name' => 'subcat_name clasicos_arabes', 'key_description' => 'subcat_desc clasicos_arabes'],
            ['key_name' => 'subcat_name clasicos_indios', 'key_description' => 'subcat_desc clasicos_indios'],
            ['key_name' => 'subcat_name clasicos_africanos', 'key_description' => 'subcat_desc clasicos_africanos'],
            ['key_name' => 'subcat_name clasicos_nordicos', 'key_description' => 'subcat_desc clasicos_nordicos'],
            ['key_name' => 'subcat_name clasicos_eslavos', 'key_description' => 'subcat_desc clasicos_eslavos'],
            ['key_name' => 'subcat_name romance_historico', 'key_description' => 'subcat_desc romance_historico'],
            ['key_name' => 'subcat_name romance_contemporaneo', 'key_description' => 'subcat_desc romance_contemporaneo'],
            ['key_name' => 'subcat_name romance_erotico', 'key_description' => 'subcat_desc romance_erotico'],
            ['key_name' => 'subcat_name romance_juvenil', 'key_description' => 'subcat_desc romance_juvenil'],
            ['key_name' => 'subcat_name romance_lgtbi', 'key_description' => 'subcat_desc romance_lgtbi'],
            ['key_name' => 'subcat_name romance_suspense', 'key_description' => 'subcat_desc romance_suspense'],
            ['key_name' => 'subcat_name romance_misterio', 'key_description' => 'subcat_desc romance_misterio'],
            ['key_name' => 'subcat_name romance_fantasia', 'key_description' => 'subcat_desc romance_fantasia'],
            ['key_name' => 'subcat_name manga_shonen', 'key_description' => 'subcat_desc manga_shonen'],
            ['key_name' => 'subcat_name manga_shojo', 'key_description' => 'subcat_desc manga_shojo'],
            ['key_name' => 'subcat_name manga_seinen', 'key_description' => 'subcat_desc manga_seinen'],
            ['key_name' => 'subcat_name manga_josei', 'key_description' => 'subcat_desc manga_josei'],
            ['key_name' => 'subcat_name manga_kodomo', 'key_description' => 'subcat_desc manga_kodomo'],
            ['key_name' => 'subcat_name manga_yaoi', 'key_description' => 'subcat_desc manga_yaoi'],
            ['key_name' => 'subcat_name manga_yuri', 'key_description' => 'subcat_desc manga_yuri'],
            ['key_name' => 'subcat_name manga_hentai', 'key_description' => 'subcat_desc manga_hentai'],
            ['key_name' => 'subcat_name manga_doujinshi', 'key_description' => 'subcat_desc manga_doujinshi'],
            ['key_name' => 'subcat_name manga_seijin', 'key_description' => 'subcat_desc manga_seijin'],
            ['key_name' => 'subcat_name manga_baras', 'key_description' => 'subcat_desc manga_baras'],
        ];

        foreach ($subcategories as $subcategory) {
            // Extraer el nombre de la categoría
            $category_name = explode(' ', $subcategory['key_name'])[1];
            // quitar lo de después de la _
            $category_name = explode('_', $category_name)[0];

            // Buscar la categoría por nombre
            $category = Category::where('key_name', 'LIKE', 'cat_name '.$category_name . '%')->first();

            if ($category) {
                // Asignar el category_id correspondiente si se encontró la categoría
                $subcategory['category_id'] = $category->id;
            } else {
                throw new Exception('La categoría correspondiente a "' . $category_name . '" no se encontró.');
            }

            // Crear la subcategoría
            Subcategory::create($subcategory);
        }

    }
}
