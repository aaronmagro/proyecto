<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Translation;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    /**
     * Devuelve todas las traducciones.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function index()
    {
        return Translation::all();
    }

    /**
     * Devuelve las traducciones en un idioma específico, incluyendo categorías, subcategorías y libros.
     *
     * @param string $idioma El idioma de las traducciones.
     * @return array
     */
    public function translations($idioma)
    {
        $traducciones = Translation::where('language', $idioma)->get()->pluck('translation', 'key');

        $categorias = [];
        $subcategorias = [];
        $books = [];

        // Categorías
        foreach ($traducciones as $key => $value) {
            if (str_starts_with($key, 'cat_')) {
                $parts = explode(' ', $key, 2); // Separar basado en el primer espacio

                if (count($parts) >= 2) {
                    $typeKey = explode('_', $parts[0]); // Dividir el primer segmento para obtener 'cat', 'name', 'desc'
                    $categoryType = $typeKey[1]; // 'name' o 'desc'
                    $categoryKey = $this->getCategoryIdFromName($parts[1]); // El identificador de la categoría

                    if (!isset($categorias[$categoryKey])) {
                        $categorias[$categoryKey] = []; // Inicializar si aún no está configurado
                    }

                    if ($categoryType === 'name') {
                        $categorias[$categoryKey]['name'] = $value;
                    } elseif ($categoryType === 'desc') {
                        $categorias[$categoryKey]['desc'] = $value;
                    }

                    // Añadir el id de la categoría
                    $categorias[$categoryKey]['id'] = $categoryKey;
                }
            }
        }

        // Subcategorías
        foreach ($traducciones as $key => $value) {
            if (str_starts_with($key, 'subcat_')) {
                $parts = explode(' ', $key, 2); // Separar basado en el primer espacio

                if (count($parts) >= 2) {
                    $typeKey = explode('_', $parts[0]); // Dividir el primer segmento para obtener 'subcat', 'name', 'desc'
                    $subcategoryType = $typeKey[1]; // 'name' o 'desc'
                    $subcategoryKey = $this->getSubcategoryIdFromName($parts[1]); // El identificador de la subcategoría

                    if (!isset($subcategorias[$subcategoryKey])) {
                        $subcategorias[$subcategoryKey] = []; // Inicializar si aún no está configurado
                    }

                    if ($subcategoryType === 'name') {
                        $subcategorias[$subcategoryKey]['name'] = $value;
                    } elseif ($subcategoryType === 'desc') {
                        $subcategorias[$subcategoryKey]['desc'] = $value;
                    }

                    // Asociar la subcategoría a su categoría por el nombre antes de la _ (subcat_name nombre _subcategoria)
                    $parts = explode('_', $parts[1], 2);
                    $categoryKey = $this->getCategoryIdFromName($parts[0]);
                    if ($categoryKey) {
                        $subcategorias[$subcategoryKey]['category_id'] = $categoryKey;
                    }

                    // Añadir el id de la subcategoría
                    $subcategorias[$subcategoryKey]['id'] = $subcategoryKey;
                }
            }
        }

        // Libros
        foreach ($traducciones as $key => $value) {
            if (str_starts_with($key, 'book_')) {
                $parts = explode(' ', $key, 2); // Separar basado en el primer espacio
                if (count($parts) >= 2) {
                    $typeKey = explode('_', $parts[0]); // Dividir el primer segmento para obtener 'book', 'title', 'desc'
                    $bookType = $typeKey[1]; // 'title' o 'desc'
                    $bookKey = $this->getBookIdFromTitle($parts[1]); // El identificador del libro

                    if (!isset($books[$bookKey])) {
                        $books[$bookKey] = []; // Inicializar si aún no está configurado
                    }
                    // Asignar el título o descripción del libro
                    if ($bookType === 'title') {
                        $books[$bookKey]['title'] = $value;
                    }
                    if ($bookType === 'desc') {
                        $books[$bookKey]['desc'] = $value;
                    }

                    // Buscar en la tabla de libros el resto de campos
                    if (isset($books[$bookKey]['title']) && isset($books[$bookKey]['desc'])) {
                        $book = Book::where('id', $bookKey)->first();
                        if ($book) {
                            $books[$bookKey]['id'] = $book->id;
                            $books[$bookKey]['isbn'] = $book->isbn;
                            $books[$bookKey]['publisher'] = $book->publisher;
                            $books[$bookKey]['language'] = $book->language;
                            $books[$bookKey]['author'] = $book->author;
                            $books[$bookKey]['price'] = $book->price;
                            $books[$bookKey]['image'] = $book->image;
                            $books[$bookKey]['subcategory_id'] = $book->subcategory_id;
                            $books[$bookKey]['average_rating'] = $book->average_rating;
                            $books[$bookKey]['rating_count'] = $book->rating_count;
                            $books[$bookKey]['comments_count'] = $book->comments_count;
                            $books[$bookKey]['created_at'] = $book->created_at;
                            $books[$bookKey]['updated_at'] = $book->updated_at;
                        }
                    }
                }
            }
        }

        return [
            'categories' => $categorias,
            'subcategories' => $subcategorias,
            'books' => $books,
        ];
    }

    /**
     * Obtiene el ID de una categoría a partir de su nombre.
     *
     * @param string $name El nombre de la categoría.
     * @return int|null El ID de la categoría o null si no se encuentra.
     */
    function getCategoryIdFromName($name)
    {
        $category = Category::where('key_name', 'LIKE', 'cat_name ' . $name . '%')->first();
        return $category ? $category->id : null;
    }

    /**
     * Obtiene el ID de una subcategoría a partir de su nombre.
     *
     * @param string $name El nombre de la subcategoría.
     * @return int|null El ID de la subcategoría o null si no se encuentra.
     */
    function getSubcategoryIdFromName($name)
    {
        $subcategory = Subcategory::where('key_name', 'LIKE', 'subcat_name ' . $name . '%')->first();
        return $subcategory ? $subcategory->id : null;
    }

    /**
     * Obtiene el ID de un libro a partir de su título.
     *
     * @param string $title El título del libro.
     * @return int|null El ID del libro o null si no se encuentra.
     */
    function getBookIdFromTitle($title)
    {
        $book = Book::where('key_title', 'LIKE', 'book_title ' . $title . '%')->first();
        return $book ? $book->id : null;
    }
}
