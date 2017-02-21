var reporteSentimiento = angular.module('reporteSentimiento', []);

function mainController($scope,$http){
  $scope.formData = {};
  $http.get("/generareporte?tipo=SentimentAnalisys&estado=CDMX")
    .success(function(data){
      //console.log(data.datos);
      var sumaResultados = {"neutral":0, "positivo":0, "negativo":0}
      data.datos.forEach(function(sentimiento){
        if(sentimiento.type == "neutral"){
          sumaResultados.neutral = sumaResultados.neutral+1;
        } else if (sentimiento.type == "positive") {
          sumaResultados.positivo = sumaResultados.positivo+1;
        } else if (sentimiento.type == "negative") {
          sumaResultados.negativo = sumaResultados.negativo +1;
        }
      })
      //console.log(sumaResultados);
      $scope.resultados = sumaResultados;
      //console.log($scope);
    })
    .error(function(data){
      console.log('Error: ' + data);
    });
}
