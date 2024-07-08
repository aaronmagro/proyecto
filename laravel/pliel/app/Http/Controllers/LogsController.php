<?php

namespace App\Http\Controllers;

use App\Models\UserLog;
use Illuminate\Http\Request;

class LogsController extends Controller
{
    /**
     * Registra una acción de usuario en los registros de la base de datos.
     *
     * @param int|null $userId
     * @param string $ipAddress
     * @param string $action
     * @param string $status
     * @return void
     */
    public static function logAction($userId, $ipAddress, $action, $status)
    {
        UserLog::create([
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'action' => $action,
            'status' => $status,
        ]);
    }

    /**
     * Muestra una lista de todos los registros de usuario.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $logs = UserLog::with('user')->get();

        // Ajustar la hora de los logs sumando 2 horas
        foreach ($logs as $log) {
            $log->created_at = $log->created_at->addHours(2);
            $log->updated_at = $log->updated_at->addHours(2);
        }
        return response()->json($logs);
    }

    /**
     * Muestra un registro de usuario específico.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $log = UserLog::with('user')->findOrFail($id);

        // Ajustar la hora del log sumando 2 horas
        $log->created_at = $log->created_at->addHours(2);
        $log->updated_at = $log->updated_at->addHours(2);

        return response()->json($log);
    }

    /**
     * Elimina un registro de usuario específico.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $log = UserLog::findOrFail($id);
        $log->delete();
        return response()->json(['message' => 'Log deleted successfully']);
    }

    /**
     * Elimina todos los registros de usuario.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyAll()
    {
        UserLog::truncate();
        return response()->json(['message' => 'All logs deleted successfully']);
    }

}
