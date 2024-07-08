<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    /**
     * Ejecuta los seeders.
     */
    public function run(): void
    {
        $categories = [
            ['key_name' => 'cat_name fantasia', 'key_description' => 'cat_desc fantasia'],
            ['key_name' => 'cat_name clasicos', 'key_description' => 'cat_desc clasicos'],
            ['key_name' => 'cat_name ficcion', 'key_description' => 'cat_desc ficcion'],
            ['key_name' => 'cat_name no-ficcion', 'key_description' => 'cat_desc no-ficcion'],
            ['key_name' => 'cat_name romance', 'key_description' => 'cat_desc romance'],
            ['key_name' => 'cat_name jovenes-adultos', 'key_description' => 'cat_desc jovenes-adultos'],
            ['key_name' => 'cat_name arte', 'key_description' => 'cat_desc arte'],
            ['key_name' => 'cat_name biografias', 'key_description' => 'cat_desc biografias'],
            ['key_name' => 'cat_name negocio', 'key_description' => 'cat_desc negocio'],
            ['key_name' => 'cat_name infantil', 'key_description' => 'cat_desc infantil'],
            ['key_name' => 'cat_name religion', 'key_description' => 'cat_desc religion'],
            ['key_name' => 'cat_name ebooks', 'key_description' => 'cat_desc ebooks'],
            ['key_name' => 'cat_name novelas-graficas', 'key_description' => 'cat_desc novelas-graficas'],
            ['key_name' => 'cat_name terror', 'key_description' => 'cat_desc terror'],
            ['key_name' => 'cat_name lgtbi', 'key_description' => 'cat_desc lgtbi'],
            ['key_name' => 'cat_name chick-lit', 'key_description' => 'cat_desc chick-lit'],
            ['key_name' => 'cat_name contemporaneo', 'key_description' => 'cat_desc contemporaneo'],
            ['key_name' => 'cat_name manga', 'key_description' => 'cat_desc manga'],
            ['key_name' => 'cat_name manhua', 'key_description' => 'cat_desc manhua'],
            ['key_name' => 'cat_name manhwa', 'key_description' => 'cat_desc manhwa'],
            ['key_name' => 'cat_name paranormal', 'key_description' => 'cat_desc paranormal'],
            ['key_name' => 'cat_name comics', 'key_description' => 'cat_desc comics'],
            ['key_name' => 'cat_name cocina', 'key_description' => 'cat_desc cocina'],
            ['key_name' => 'cat_name historia', 'key_description' => 'cat_desc historia'],
            ['key_name' => 'cat_name humor', 'key_description' => 'cat_desc humor'],
            ['key_name' => 'cat_name misterio', 'key_description' => 'cat_desc misterio'],
            ['key_name' => 'cat_name poesia', 'key_description' => 'cat_desc poesia'],
            ['key_name' => 'cat_name politica', 'key_description' => 'cat_desc politica'],
            ['key_name' => 'cat_name ciencia', 'key_description' => 'cat_desc ciencia'],
            ['key_name' => 'cat_name deportes', 'key_description' => 'cat_desc deportes'],
            ['key_name' => 'cat_name autoayuda', 'key_description' => 'cat_desc autoayuda'],
            ['key_name' => 'cat_name thriller', 'key_description' => 'cat_desc thriller'],
            ['key_name' => 'cat_name suspense', 'key_description' => 'cat_desc suspense'],
            ['key_name' => 'cat_name psicologia', 'key_description' => 'cat_desc psicologia'],
            ['key_name' => 'cat_name crimen', 'key_description' => 'cat_desc crimen'],
            ['key_name' => 'cat_name viajes', 'key_description' => 'cat_desc viajes'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
