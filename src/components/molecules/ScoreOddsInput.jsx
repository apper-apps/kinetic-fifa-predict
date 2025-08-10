import { useState } from "react";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ScoreOddsInput = ({ index, value, onChange, onRemove }) => {
  const [localScore, setLocalScore] = useState(value?.score || "");
  const [localOdds, setLocalOdds] = useState(value?.coefficient || "");

  const handleScoreChange = (e) => {
    const newScore = e.target.value;
    setLocalScore(newScore);
    onChange(index, { score: newScore, coefficient: localOdds });
  };

  const handleOddsChange = (e) => {
    const newOdds = e.target.value;
    setLocalOdds(newOdds);
    onChange(index, { score: localScore, coefficient: newOdds });
  };

  const getProbability = () => {
    if (!localOdds || isNaN(localOdds) || localOdds <= 0) return 0;
    return ((1 / parseFloat(localOdds)) * 100).toFixed(1);
  };

  const getConfidenceColor = () => {
    const prob = parseFloat(getProbability());
    if (prob >= 15) return "text-primary";
    if (prob >= 10) return "text-accent";
    if (prob >= 5) return "text-warning";
    return "text-gray-400";
  };

  return (
    <div className="bg-surface/30 border border-secondary-400/20 rounded-lg p-4 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">Score #{index + 1}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-error hover:text-error/80 h-6 w-6 p-0"
        >
          <ApperIcon name="X" size={14} />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <Label className="text-xs text-gray-400 mb-1">Score</Label>
          <Input
            placeholder="0-0"
            value={localScore}
            onChange={handleScoreChange}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-400 mb-1">Coefficient</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="2.50"
            value={localOdds}
            onChange={handleOddsChange}
            className="h-8 text-sm"
          />
        </div>
      </div>
      
      {localOdds && (
        <div className="text-xs">
          <span className="text-gray-400">Probabilité: </span>
          <span className={`font-semibold ${getConfidenceColor()}`}>
            {getProbability()}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ScoreOddsInput;