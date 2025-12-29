package com.smarthub.smart_career_hub_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "chercheurs")
public class ChercheurEmploi extends Utilisateur {

    @OneToMany(mappedBy = "chercheurEmploi")
    @JsonIgnore
    private List<Quiz> quizList;

    @OneToMany(mappedBy = "chercheurEmploi")
    @JsonIgnore
    private List<Coaching> coachings;
}
