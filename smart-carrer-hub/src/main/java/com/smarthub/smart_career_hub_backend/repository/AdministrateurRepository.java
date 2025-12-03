//ici on va créer les interfaces JpaRepository ou CrudRepository , sert à accéder à la bdd sans écrire sql manuellement
package com.smarthub.smart_career_hub_backend.repository;

import com.smarthub.smart_career_hub_backend.entity.Administrateur;// entity
import org.springframework.data.jpa.repository.JpaRepository; // Import de JpaRepository pour gérer les opérations CRUD automatiquement
import org.springframework.stereotype.Repository; // Import de l'annotation Repository

// Annotation pour indiquer à Spring que c'est un composant Repository
@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {

}
/// JpaRepository fournit déjà les méthodes CRUD suivantes automatiquement  je veut les mettre ensuite seoln my needs