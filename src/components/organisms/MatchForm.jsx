import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import ScoreOddsInput from "@/components/molecules/ScoreOddsInput";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const MatchForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    matchDate: "",
    matchTime: "",
    scoreOdds: Array(5).fill({ score: "", coefficient: "" })
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleScoreOddsChange = (index, data) => {
    setFormData(prev => {
      const newScoreOdds = [...prev.scoreOdds];
      newScoreOdds[index] = data;
      return { ...prev, scoreOdds: newScoreOdds };
    });
  };

  const addScoreField = () => {
    if (formData.scoreOdds.length < 20) {
      setFormData(prev => ({
        ...prev,
        scoreOdds: [...prev.scoreOdds, { score: "", coefficient: "" }]
      }));
    }
  };

  const removeScoreField = (index) => {
    if (formData.scoreOdds.length > 1) {
      setFormData(prev => ({
        ...prev,
        scoreOdds: prev.scoreOdds.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.homeTeam.trim()) {
      newErrors.homeTeam = "L'équipe domicile est requise";
    }
    if (!formData.awayTeam.trim()) {
      newErrors.awayTeam = "L'équipe visiteur est requise";
    }
    if (!formData.matchDate) {
      newErrors.matchDate = "La date du match est requise";
    }
    if (!formData.matchTime) {
      newErrors.matchTime = "L'heure du match est requise";
    }

    const validScoreOdds = formData.scoreOdds.filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    );

    if (validScoreOdds.length < 3) {
      newErrors.scoreOdds = "Minimum 3 scores avec coefficients sont requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    const validScoreOdds = formData.scoreOdds.filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    );

    const matchData = {
      homeTeam: formData.homeTeam.trim(),
      awayTeam: formData.awayTeam.trim(),
      dateTime: `${formData.matchDate} ${formData.matchTime}`,
      scoreOdds: validScoreOdds.map(item => ({
        score: item.score.trim(),
        coefficient: parseFloat(item.coefficient),
        probability: ((1 / parseFloat(item.coefficient)) * 100).toFixed(1)
      }))
    };

    onSubmit(matchData);
  };

  const clearForm = () => {
    setFormData({
      homeTeam: "",
      awayTeam: "",
      matchDate: "",
      matchTime: "",
      scoreOdds: Array(5).fill({ score: "", coefficient: "" })
    });
    setErrors({});
    toast.success("Formulaire réinitialisé");
  };

  const getFilledScoresCount = () => {
    return formData.scoreOdds.filter(
      item => item.score && item.coefficient && !isNaN(item.coefficient)
    ).length;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" size={20} className="text-black" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">Nouveau Match</h2>
            <p className="text-sm text-gray-400">FIFA Virtual - FC 24 Championship</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearForm}
          className="flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={16} />
          Effacer
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Équipe Domicile"
            placeholder="Manchester City"
            value={formData.homeTeam}
            onChange={(e) => handleInputChange("homeTeam", e.target.value)}
            error={errors.homeTeam}
            required
          />
          <FormField
            label="Équipe Visiteur"
            placeholder="Liverpool"
            value={formData.awayTeam}
            onChange={(e) => handleInputChange("awayTeam", e.target.value)}
            error={errors.awayTeam}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Date du Match"
            type="date"
            value={formData.matchDate}
            onChange={(e) => handleInputChange("matchDate", e.target.value)}
            error={errors.matchDate}
            required
          />
          <FormField
            label="Heure du Match"
            type="time"
            value={formData.matchTime}
            onChange={(e) => handleInputChange("matchTime", e.target.value)}
            error={errors.matchTime}
            required
          />
        </div>

        <div className="border-t border-primary/20 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Scores et Coefficients</h3>
              <p className="text-sm text-gray-400">
                {getFilledScoresCount()}/20 scores remplis • Min. 3 requis
              </p>
            </div>
            {formData.scoreOdds.length < 20 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addScoreField}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                Ajouter
              </Button>
            )}
          </div>

          {errors.scoreOdds && (
            <p className="text-sm text-error mb-4">{errors.scoreOdds}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {formData.scoreOdds.map((scoreOdds, index) => (
              <ScoreOddsInput
                key={index}
                index={index}
                value={scoreOdds}
                onChange={handleScoreOddsChange}
                onRemove={removeScoreField}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-primary/20">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 h-12"
          >
            {isLoading ? (
              <>
                <ApperIcon name="Loader2" size={20} className="animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <ApperIcon name="Brain" size={20} />
                Générer Prédiction IA
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MatchForm;