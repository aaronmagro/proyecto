# Proyecto TFC

## Manual de instalación

Docker, PHP8.2, Composer, node.js y la WSL instalados.

##### En Laravel:

En el proyecto:

```
composer install
```

Dentro del WSL:

```
sail up
```

##### En Angular:

En el proyecto:

```
npm install
```

```
ng serve -o
```



#### Para uso de la página:

Comandos:

```
sail artisan migrate:fresh --seed
```

```
sail artisan passport:client --personal
```

*Añadimos cualquier nombre*

**Usuario administrador:**

- username: admin
- password: admin

**Usuario normal:**

- username: user
- password: user
