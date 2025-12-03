
//entity or model : les classes = les tables de la bdd
package com.smarthub.smart_career_hub_backend.entity;

import jakarta.persistence.*;// pour importer les annotation et classes jpa
import lombok.*;

import java.util.List; //importer l'interface list pour stocker la collection de notif
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity // cette classe est une entité persistante elle sera mappée à une table bdd permet de demander constructeur sans argument
@Table(name = "administrateurs")// pour modifier le nom de la table par rapport le classe dans la bdd
public class Administrateur extends Utilisateur {
   // il hérite les attributs du class user
    @OneToMany(mappedBy = "administrateur") //relation un à pluisuers : admin can get multiple notif
    private List<Notification> notifications ;// list of objects notif

    // Getters et Setters
}
