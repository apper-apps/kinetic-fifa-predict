import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const OddsVisualization = ({ scoreOdds, prediction }) => {
  const chartData = useMemo(() => {
    if (!scoreOdds || scoreOdds.length === 0) {
      return {
        series: [],
        categories: [],
        colors: [],
        megapariData: null
      };
    }

    const sortedOdds = [...scoreOdds]
      .filter(item => item.score && item.coefficient)
      .sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability)) // Tri par probabilité décroissante
      .slice(0, 15);

    const series = sortedOdds.map(item => parseFloat(item.probability));
    const categories = sortedOdds.map(item => item.score);
    
    // Couleurs améliorées pour MEGAPARI
    const colors = sortedOdds.map((item, index) => {
      const prob = parseFloat(item.probability);
      const isMegapariOptimized = item.megapariOptimized || prediction?.megapariData;
      
      if (index === 0 && isMegapariOptimized) return "#00FF87"; // Meilleure prédiction MEGAPARI
      if (prob >= 20) return "#00FF87"; // Très haute probabilité
      if (prob >= 15) return "#FFD700"; // Haute probabilité
      if (prob >= 10) return "#FFB800"; // Moyenne probabilité
      if (prob >= 7) return "#FF8800"; // Faible probabilité
      return "#6B7280"; // Très faible
    });

    // Métadonnées MEGAPARI
    const megapariData = prediction?.megapariData ? {
      applicationId: prediction.megapariData.applicationId,
      geneticOptimization: prediction.megapariData.geneticOptimization,
      methodology: prediction.megapariData.methodology
    } : null;

    return { series, categories, colors, megapariData };
  }, [scoreOdds, prediction]);

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      background: "transparent",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false,
        columnWidth: "70%",
        distributed: true
      }
    },
    colors: chartData.colors,
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        fontSize: "10px",
        fontWeight: "bold",
        colors: ["#FFFFFF"]
      }
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "11px"
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}%`,
        style: {
          colors: "#9CA3AF",
          fontSize: "11px"
        }
      }
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        backgroundColor: "#1F2937"
      },
      y: {
formatter: (val, { dataPointIndex }) => {
          const score = chartData.categories[dataPointIndex];
          const scoreData = scoreOdds.find(item => item.score === score);
          const coefficient = scoreData?.coefficient;
          const megapariOptimized = scoreData?.megapariOptimized;
          
          let tooltip = `${val}% (Cote: ${coefficient})`;
          if (megapariOptimized) {
            tooltip += `\nOptimisé MEGAPARI: ${megapariOptimized}%`;
          }
          if (chartData.megapariData && dataPointIndex === 0) {
            tooltip += `\nIA Génétique: ${chartData.megapariData.applicationId}`;
          }
          
          return tooltip;
        }
      }
    },
    legend: { show: false }
  };

  if (!scoreOdds || scoreOdds.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center border-dashed border-primary/30">
        <div className="text-center">
          <ApperIcon name="BarChart3" size={48} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 font-medium">Visualisation des Cotes</p>
          <p className="text-sm text-gray-500 mt-2">
            Ajoutez des scores pour voir l'analyse
          </p>
        </div>
      </Card>
    );
  }

  const bestOdds = scoreOdds
    .filter(item => item.score && item.coefficient)
    .sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability))
    .slice(0, 3);

  const avgCoefficient = scoreOdds
    .filter(item => item.coefficient && !isNaN(item.coefficient))
    .reduce((sum, item) => sum + parseFloat(item.coefficient), 0) / 
    scoreOdds.filter(item => item.coefficient && !isNaN(item.coefficient)).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="TrendingUp" size={20} className="text-black" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">Analyse des Cotes</h3>
            <p className="text-sm text-gray-400">Probabilités selon les bookmakers</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <ReactApexChart
          options={chartOptions}
          series={[{ name: "Probabilité", data: chartData.series }]}
          type="bar"
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface/30 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Crown" size={16} className="text-accent" />
            <span className="text-sm font-medium text-gray-300">Meilleure Probabilité</span>
          </div>
          {bestOdds[0] && (
            <div>
              <div className="text-lg font-bold text-primary">{bestOdds[0].score}</div>
              <div className="text-sm text-gray-400">
                {bestOdds[0].probability}% (Cote: {bestOdds[0].coefficient})
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface/30 rounded-lg p-4 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Calculator" size={16} className="text-accent" />
            <span className="text-sm font-medium text-gray-300">Cote Moyenne</span>
          </div>
          <div className="text-lg font-bold text-accent">
            {avgCoefficient ? avgCoefficient.toFixed(2) : "N/A"}
          </div>
          <div className="text-sm text-gray-400">
            Sur {scoreOdds.filter(item => item.coefficient && !isNaN(item.coefficient)).length} scores
          </div>
        </div>

        <div className="bg-surface/30 rounded-lg p-4 border border-info/20">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Target" size={16} className="text-info" />
            <span className="text-sm font-medium text-gray-300">Prédiction IA</span>
          </div>
          {prediction?.predictedScore ? (
            <div>
              <div className="text-lg font-bold text-info">{prediction.predictedScore}</div>
              <div className="text-sm text-gray-400">
                Confiance: {prediction.confidence}%
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">En attente...</div>
          )}
        </div>
      </div>

      {bestOdds.length > 1 && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Top 3 Scores Probables:</h4>
          <div className="space-y-2">
            {bestOdds.map((odds, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-surface/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary/20 text-primary rounded-full text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-white">{odds.score}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">{odds.probability}%</div>
                  <div className="text-xs text-gray-500">Cote: {odds.coefficient}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default OddsVisualization;