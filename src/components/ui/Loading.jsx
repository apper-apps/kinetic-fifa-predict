import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
            <ApperIcon name="Brain" size={24} className="text-black" />
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-primary/30 animate-spin border-t-primary"></div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          
          <h3 className="text-xl font-semibold text-white">Chargement...</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Préparation de votre expérience de prédiction FIFA Virtual
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface/30 rounded-lg p-4 border border-primary/10">
              <div className="w-full h-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded shimmer mb-3"></div>
              <div className="w-2/3 h-2 bg-gray-600/30 rounded shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;