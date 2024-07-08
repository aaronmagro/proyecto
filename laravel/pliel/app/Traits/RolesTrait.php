<?php

namespace App\Traits;

use App\Models\Role;

/**
 * Trait RolesTrait
 *
 * Proporciona métodos para gestionar los roles de un usuario.
 */
trait RolesTrait
{
    /**
     * Obtiene los nombres de los roles de un usuario.
     *
     * @return array
     */
    public function roleNames()
    {
        return $this->roles->pluck('name')->toArray();
    }

    /**
     * Verifica si un usuario tiene un rol específico por nombre.
     *
     * @param string $roleName
     * @return bool
     */
    public function hasRole($roleName)
    {
        return $this->roles->contains('name', $roleName);
    }

    /**
     * Verifica si un usuario tiene un rol específico por ID.
     *
     * @param int $roleId
     * @return bool
     */
    public function hasRoleId($roleId)
    {
        return $this->roles->contains('id', $roleId);
    }

    /**
     * Añade un rol a un usuario por ID.
     *
     * @param int $roleId
     */
    public function addRoleId($roleId)
    {
        $this->roles()->attach($roleId);
    }

    /**
     * Añade un rol a un usuario por nombre.
     *
     * @param string $roleName
     */
    public function addRole($roleName)
    {
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $this->roles()->attach($role->id);
        }
    }

    /**
     * Elimina un rol de un usuario por ID.
     *
     * @param int $roleId
     */
    public function removeRoleId($roleId)
    {
        $this->roles()->detach($roleId);
    }

    /**
     * Elimina un rol de un usuario por nombre.
     *
     * @param string $roleName
     */
    public function removeRole($roleName)
    {
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $this->roles()->detach($role->id);
        }
    }

    /**
     * Sincroniza los roles de un usuario con un conjunto dado de IDs de roles.
     *
     * @param array $roleIds
     */
    public function syncRolesIds(array $roleIds)
    {
        $this->roles()->sync($roleIds);
    }

    /**
     * Sincroniza los roles de un usuario con un conjunto dado de nombres de roles.
     *
     * @param array $roleNames
     */
    public function syncRoles(array $roleNames)
    {
        $rolesIds = [];

        foreach ($roleNames as $roleName) {
            $role = Role::where('name', $roleName)->first();

            if ($role) {
                $rolesIds[] = $role->id;
            }
        }
        $this->roles()->sync($rolesIds);
    }
}
