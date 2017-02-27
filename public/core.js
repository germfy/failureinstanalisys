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
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function check(input) {
  if (input.value != document.getElementById('email_addr').value) {
    input.setCustomValidity('Los dos correos electrónicos deben de coincidir');
  } else {
    // input is valid -- reset the error message
    input.setCustomValidity('');
  }
}