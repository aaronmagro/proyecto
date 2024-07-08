<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BooksController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LogsController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\SubcategoriesController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\UsersController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

/* --------------------------------------------------------------------------------- */

Route::fallback(function () {
    return response()->json(['message' => 'Recurso no existente'], 404);
});

/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - - - AUTH - - - - - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::middleware('web')->group(function () {
    Route::get('/login-google', function () {
        return Socialite::driver('google')->redirect();
    });
    Route::get('/google-callback', [AuthController::class, 'authenticateWithGoogle']);
});

// Rutas para la autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/login/info', [AuthController::class, 'info']);
    Route::get('/login/roles', [AuthController::class, 'getRoles']);

    Route::get('/logs', [LogsController::class, 'index']);
    Route::get('/logs/{id}', [LogsController::class, 'show']);
    Route::delete('/logs/{id}', [LogsController::class, 'destroy']);
});


/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - RESTABLECIMIENTO DE CONTRASEÑA - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->name('password.update');

/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - - TRADUCCIONES - - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::get('/translations', [TranslationController::class, 'index']);
Route::get('/translations/{language}', [TranslationController::class, 'translations']);

/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - - VALIDACIONES - - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::post('/check-email', function (Request $request) {
    return response()->json([
        'exists' => User::where('email', $request->email)->exists()
    ]);
});

Route::post('/check-username', function (Request $request) {
    return response()->json([
        'exists' => User::where('username', $request->username)->exists()
    ]);
});

Route::get('/check-username/{username}/{userId}', [UsersController::class, 'checkUsername']);
Route::get('/check-email/{email}/{userId}', [UsersController::class, 'checkEmail']);

/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - - VALORACIONES - - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::get('/ratings/{id}', [RatingController::class, 'show']);

Route::middleware('auth:api')->group(function () {
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::get('/ratings/user/{id}', [RatingController::class, 'showUserRating']);
});

/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - - COMENTARIOS - - - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::get('/books/{bookId}/comments', [CommentController::class, 'index']);

Route::middleware('auth:api')->group(function () {
    Route::post('/books/{bookId}/comments', [CommentController::class, 'store']);
    Route::post('/books/{bookId}/comments/{commentId}', [CommentController::class, 'destroy']);
});

/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - PROFILE SETTINGS - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::middleware('auth:api')->group(function () {
    Route::post('/user/update-profile', [AuthController::class, 'updateUser']);
    Route::post('/user/update-password', [AuthController::class, 'updatePassword']);
    Route::post('/user/delete-profile', [AuthController::class, 'deleteUser']);
});

/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - - ADMIN SETTINGS - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::middleware(['auth:api', 'can:admin-access'])->group(function () {

    Route::get('/books/{id}', [BooksController::class, 'show']);
    Route::get('/books-translations/{id}', [BooksController::class, 'showTranslations']);
    Route::post('/books', [BooksController::class, 'store']);
    Route::post('/update-books/{id}', [BooksController::class, 'update']);
    Route::post('/destroy-books/{id}', [BooksController::class, 'destroy']);

    Route::get('/category/{id}', [CategoriesController::class, 'show']);
    Route::get('/category-translations/{id}', [CategoriesController::class, 'showTranslations']);
    Route::post('/category', [CategoriesController::class, 'store']);
    Route::post('/update-category/{id}', [CategoriesController::class, 'update']);
    Route::post('/destroy-category/{id}', [CategoriesController::class, 'destroy']);

    Route::get('/subcategory/{id}', [SubcategoriesController::class, 'show']);
    Route::get('/subcategory-translations/{id}', [SubcategoriesController::class, 'showTranslations']);
    Route::post('/subcategory', [SubcategoriesController::class, 'store']);
    Route::post('/update-subcategory/{id}', [SubcategoriesController::class, 'update']);
    Route::post('/destroy-subcategory/{id}', [SubcategoriesController::class, 'destroy']);

    Route::get('/users', [UsersController::class, 'index']);
    Route::get('/users/{id}', [UsersController::class, 'show']);
    Route::post('/users', [UsersController::class, 'store']);
    Route::post('/update-users/{id}', [UsersController::class, 'update']);
    Route::post('/destroy-users/{id}', [UsersController::class, 'destroy']);

    Route::get('/user/statistics', [StatisticController::class, 'getUserStatistics']);

});


/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - - - - LOGS - - - - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::middleware(['auth:api', 'can:admin-access'])->group(function () {
    Route::get('/logs', [LogsController::class, 'index'])->name('logs.index');
    Route::get('/logs/{id}', [LogsController::class, 'show'])->name('logs.show');
    Route::post('/destroy-logs/{id}', [LogsController::class, 'destroy'])->name('logs.destroy');
    Route::post('/destroy-all-logs', [LogsController::class, 'destroyAll'])->name('logs.destroyAll');
});


/* --------------------------------------------------------------------------------- */

/*-------------------------------------------------------------------------------------
- - - - - - - - - - - - - - - - - - - - TESTS - - - - - - - - - - - - - - - - - - - - -
--------------------------------------------------------------------------------------*/

Route::get('/test/prueba1', [TestController::class, 'prueba1']);

Route::middleware('auth:api')->group(function () {
    Route::get('/test/prueba2', [TestController::class, 'prueba2']);
    Route::get('/test/prueba3', [TestController::class, 'prueba3'])->middleware('can:admin-access');
});

/* --------------------------------------------------------------------------------- */

