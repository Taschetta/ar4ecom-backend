CREATE TABLE sesion
(
	fkUsuario INTEGER UNSIGNED NOT NULL,
	token VARCHAR(255) NOT NULL,
	PRIMARY KEY (fkUsuario),
	UNIQUE UQ_Sesion_token(token),
	KEY (fkUsuario)
) 
;

CREATE TABLE suscripcion
(
	id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
	fkUsuario INTEGER UNSIGNED NOT NULL,
	fkPublicacion INTEGER UNSIGNED NOT NULL,
	fechaAlta DATETIME NOT NULL,
	info TEXT NULL,
	etiqueta_url VARCHAR(255) NULL,
	url_suscriptor TEXT NULL,
	notas TEXT NULL,
	PRIMARY KEY (id),
	KEY (fkPublicacion),
	KEY (fkUsuario)
) 
;

CREATE TABLE publicacion
(
	id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
	fkUsuario INTEGER UNSIGNED NOT NULL,
	privado BIT NOT NULL DEFAULT 1,
	titulo VARCHAR(255) NOT NULL,
	descripcion TEXT NOT NULL,
	etiquetas TEXT NOT NULL,
	prePublicacion TEXT NOT NULL,
	fechaActualizado DATETIME NOT NULL,
	PRIMARY KEY (id),
	KEY (fkUsuario)
) 
;

CREATE TABLE usuario
(
	id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL,
	contraseña VARCHAR(255) NOT NULL,
	activo BIT NOT NULL DEFAULT 1,
	PRIMARY KEY (id),
	UNIQUE UQ_Usuario_email(email),
	UNIQUE UQ_Usuario_nombre(nombre)
)
;

ALTER TABLE sesion ADD CONSTRAINT FK_sesion_usuario 
	FOREIGN KEY (fkUsuario) REFERENCES Usuario (id)
	ON DELETE CASCADE ON UPDATE CASCADE
;

ALTER TABLE suscripcion ADD CONSTRAINT FK_suscripcion_publicacion 
	FOREIGN KEY (fkPublicacion) REFERENCES Publicacion (id)
;

ALTER TABLE suscripcion ADD CONSTRAINT FK_suscripcion_usuario 
	FOREIGN KEY (fkUsuario) REFERENCES Usuario (id)
	ON DELETE CASCADE
;

ALTER TABLE publicacion ADD CONSTRAINT FK_publicacion_usuario 
	FOREIGN KEY (fkUsuario) REFERENCES Usuario (id)
;
