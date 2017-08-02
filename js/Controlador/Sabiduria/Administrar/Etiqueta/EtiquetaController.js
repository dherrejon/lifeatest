app.controller("EtiquetaController", function($scope, $window, $http, $rootScope, md5, $q, CONFIG, datosUsuario, $location, ETIQUETA)
{   
    $scope.etiqueta = [];
    $scope.ordenarEtiqueta = "Nombre";
    $scope.operacion = "";
    
    $scope.nuevaEtiqueta = null;
    $scope.etiquetaActualizar = null;
    $scope.mensajeError = [];
    $scope.claseEtiqueta = {nombre:"entrada"};
    
    $scope.buscarEtiqueta = "";
    
    $scope.GetEtiqueta = function()              
    {
        GetEtiqueta($http, $q, CONFIG, $scope.usuarioLogeado.UsuarioId).then(function(data)
        {
            $scope.etiqueta = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual
    $scope.CambiarOrdenarEtiqueta = function(campoOrdenar)
    {
        if($scope.ordenarEtiqueta == campoOrdenar)
        {
            $scope.ordenarEtiqueta = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarEtiqueta = campoOrdenar;
        }
    };
    
    //Filtrar
    $scope.FiltrarBuscarEtiqueta = function(etiqueta)
    {
        if($scope.buscarEtiqueta !== undefined)
        {
            if($scope.buscarEtiqueta.length > 0)
            {
                var index = etiqueta.Nombre.toLowerCase().indexOf($scope.buscarEtiqueta.toLowerCase());


                if(index < 0)
                {
                    return false;
                }
                else
                {
                    if(index === 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            else
            {
                return true;
            }
        }
        else
        {
            return true;
        }
    };
    
    /*-----------------Abrir Panel Agregar-Editar termino-------------------*/
    $scope.AbrirEtiqueta = function(operacion, etiqueta)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevaEtiqueta = new Etiqueta();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaEtiqueta = SetEtiqueta(etiqueta);
        }
        
        $scope.etiquetaInicial =  jQuery.extend({}, $scope.nuevaEtiqueta);
        $('#modalEtiqueta').modal('toggle');
    };
    
    $scope.CerrarEtiquetaModal = function()
    {
        if(JSON.stringify($scope.etiquetaInicial) === JSON.stringify($scope.nuevaEtiqueta))
        {
            $('#modalEtiqueta').modal('toggle');
        }
        else
        {
            $('#cerrarEtiquetaModal').modal('toggle');
        }
    };
    
    $scope.ConfirmarCerrarEtiquetaModal = function()
    {
        $('#modalEtiqueta').modal('toggle');
        $scope.mensajeError = [];
        $scope.claseEtiqueta = {nombre:"entrada"};
    };
    
    $scope.LimpiarEtiqueta = function()
    {
        $scope.nuevaEtiqueta.Nombre = "";
    };
    
    $('#modalEtiqueta').keydown(function(e)
    {
        switch(e.which) {
            case 13:
                document.getElementById("terminarEtiqueta").click();
              break;

            default:
                return;
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    
    /*----------------- Terminar agregar-editar etiqueta --------------------*/
    $scope.TerminarEtiqueta = function()
    {
        if(!$scope.ValidarDatos())
        {
            $('#mensajeEtiqueta').modal('toggle');
            return;
        }
        else
        {
            if($scope.operacion == "Agregar" || $scope.operacion == "AgregarExterior")
            {
                $scope.nuevaEtiqueta.UsuarioId = $rootScope.UsuarioId;
                $scope.AgregarEtiqueta();
            }
            else if($scope.operacion == "Editar" || $scope.operacion == "EditarExterior")
            {
                $scope.EditarEtiqueta();
            }
        }
    };
        
    //agrega un tipo de unidad
    $scope.AgregarEtiqueta = function()    
    {
        AgregarEtiqueta($http, CONFIG, $q, $scope.nuevaEtiqueta).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                //$('#modalEtiqueta').modal('toggle');
                
                if($scope.operacion == "Agregar")
                {
                    $scope.GetEtiqueta();
                }
                else
                {
                    $scope.nuevaEtiqueta.EtiquetaId = data[1].Id;
                    $scope.etiqueta.push($scope.nuevaEtiqueta);
                    ETIQUETA.TerminarEtiqueta($scope.nuevaEtiqueta);
                }
                
                $scope.mensaje = "Etiqueta Agregada.";
                $scope.nuevaEtiqueta = new Etiqueta();
                $scope.EnviarAlerta('Exito');
            }
            else
            {
                 $scope.mensajeError[$scope.mensajeError.length]  = "Ha ocurrido un error. Intente más tarde.";
                $('#mensajeEtiqueta').modal('toggle');
            }
            
        }).catch(function(error)
        {
            $scope.mensajeError[$scope.mensajeError.length]  = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeEtiqueta').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarEtiqueta = function()
    {
        EditarEtiqueta($http, CONFIG, $q, $scope.nuevaEtiqueta).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                if($scope.operacion == "Editar")
                {
                    //$scope.GetEtiqueta();
                    $scope.mensaje = "Etiqueta editada";
                    $scope.EnviarAlerta('ExitosoEditar');
                }
                else if($scope.operacion == "EditarExterior")
                {
                    ETIQUETA.TerminarEditarEtiqueta($scope.nuevaEtiqueta);
                }
                
                $scope.SetNuevaEtiqueta($scope.nuevaEtiqueta);
                $('#modalEtiqueta').modal('toggle');
                
            }
            else
            {
                $scope.mensajeError[$scope.mensajeError.length] = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeEtiqueta').modal('toggle');
            }
           
        }).catch(function(error)
        {
             $scope.mensajeError[$scope.mensajeError.length]  = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeEtiqueta').modal('toggle');
        });
    };
    
    $scope.SetNuevaEtiqueta = function(etiqueta)
    {
        if($scope.operacion == "Editar" || $scope.operacion == "EditarExterior")
        {
            for(var k=0; k<$scope.etiqueta.length; k++)
            {
                if($scope.etiqueta[k].EtiquetaId == etiqueta.EtiquetaId)
                {
                    $scope.etiqueta[k] = jQuery.extend({}, etiqueta);
                    break;
                }
            }
        }
    };
    
    $scope.ValidarDatos = function()
    {
        $scope.mensajeError = [];
        
        if(($rootScope.erEtiqueta.test($scope.nuevaEtiqueta.Nombre) || $rootScope.erTema.test($scope.nuevaEtiqueta.Nombre)))
        {
            $scope.claseEtiqueta.nombre = "entrada";
        }
        else
        {
             $scope.claseEtiqueta.nombre = "entradaError";
             $scope.mensajeError[$scope.mensajeError.length] = "*Escribe una etiqueta válida.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;        
        }
        
        for(var k=0; k<$scope.etiqueta.length; k++)
        {
            if($scope.etiqueta[k].Nombre.toLowerCase() == $scope.nuevaEtiqueta.Nombre.toLowerCase() && $scope.etiqueta[k].EtiquetaId != $scope.nuevaEtiqueta.EtiquetaId)
            {
                $scope.claseEtiqueta.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*La etiqueta " + $scope.nuevaEtiqueta.Nombre.toLowerCase() + " ya existe.";
                $scope.nuevaEtiqueta.Nombre = "";
                return false;
            }
        }
        
        return true;
    };
    
    /*-------------- Activar y desactivar etiqueta ------------------*/
    $scope.ActivarDesactivarEtiqueta = function(etiqueta) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.etiquetaActualizar = etiqueta;
        
        if(etiqueta.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + etiqueta.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACRIVAR - " + etiqueta.Nombre + "?";
        }
        $('#modalActivarDesactivarEtiqueta').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarEtiqueta = function()  
    {
        var datos = [];
        if($scope.etiquetaActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.etiquetaActualizar.EtiquetaId;

        ActivarDesactivarEtiqueta($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "La etiqueta se ha actualizado.";
                $scope.EnviarAlerta('ExitosoEditar');
            }
            else
            {
                $scope.etiquetaActualizar.Activo = !$scope.etiquetaActualizar.Activo;
                $scope.mensajeError[$scope.mensajeError.length] = "Ha ocurrido un error. Intente más tarde.";
                $('#mensajeEtiqueta').modal('toggle');
            }
            
        }).catch(function(error)
        {
            $scope.etiquetaActualizar.Activo = !$scope.etiquetaActualizar.Activo;
            $scope.mensajeError[$scope.mensajeError.length] = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeEtiqueta').modal('toggle');
        });
    };
    
    $scope.EnviarAlerta = function(alerta)
    {
        if(alerta == "Exito")
        {
            $("#alertaExitosoEtiqueta").alert();

            $("#alertaExitosoEtiqueta").fadeIn();
            setTimeout(function () {
                $("#alertaExitosoEtiqueta").fadeOut();
            }, 2000);
        }
        else if('ExitosoEditar')
        {
            $("#alertaEditarExitosoEtiqueta").alert();

            $("#alertaEditarExitosoEtiqueta").fadeIn();
            setTimeout(function () {
                $("#alertaEditarExitosoEtiqueta").fadeOut();
            }, 2000)
        }
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarCambiarActivoEtiqueta = function()           
    {
        $scope.etiquetaActualizar.Activo = !$scope.etiquetaActualizar.Activo;
    };
    
    //------------------------  Borrar --------------------------------------
    $scope.BorrarEtiqueta = function(etiqueta)
    {
        $scope.borrarEtiqueta = etiqueta.EtiquetaId;
        
        $scope.mensajeBorrar = "¿Estas seguro de eliminar " + etiqueta.Nombre + "?";
        
        $("#borrarEtiqueta").modal('toggle');
    };
    
    $scope.ConfirmarBorrarEtiqueta = function()
    {
        BorrarEtiqueta($http, CONFIG, $q, $scope.borrarEtiqueta).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {                
                for(var k=0; k<$scope.etiqueta.length; k++)
                {
                    if($scope.etiqueta[k].EtiquetaId == $scope.borrarEtiqueta)
                    {
                        $scope.etiqueta.splice(k,1);
                        break;
                    }
                }
                
                $scope.mensaje = "Etiqueta borrada.";
                $scope.EnviarAlerta('Vista');
                
            }
            else
            {
                $scope.mensajeError[$scope.mensajeError.length] = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeEtiqueta').modal('toggle');
            }
            
        });
    };
    
    //----------------- Limpiar -----------------------
    $scope.LimpiarBuscar = function(buscar)
    {
        switch(buscar)
        {
            case 1:
                $scope.buscarEtiqueta = "";
                break;
            default: 
                break;
        }
    };
    
    
    
    
    /*----------------------- Usuario logeado --------------------------*/
    //----------------------Inicializar---------------------------------
    $scope.InicializarControlador = function()
    {
        $scope.GetEtiqueta();
    };
    
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    //verifica que haya un usuario logeado
    if($scope.usuarioLogeado !== null)
    {
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
             $location.path('/Login');
        }
        else
        {
            $scope.InicializarControlador();
        }
    }
    
    //destecta cuando los datos del usuario cambian
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $location.path('/Login');
            return;
        }
        else
        {
            $scope.InicializarControlador();
        }
    });
    
    /*---------------- EXTERIOR -------------------------*/
    $scope.$on('AgregarEtiqueta',function()
    {
        $scope.operacion = "AgregarExterior";

        $scope.nuevaEtiqueta = new Etiqueta();
    
        $('#modalEtiqueta').modal('toggle');
        
        $scope.etiquetaInicial = new Etiqueta();
    });
    
    $scope.$on('EditarEtiqueta',function()
    {
        $scope.operacion = "EditarExterior";

        $scope.nuevaEtiqueta = SetEtiqueta(ETIQUETA.GetEtiqueta());
    
        $('#modalEtiqueta').modal('toggle');
        
        $scope.etiquetaInicial =  jQuery.extend({}, $scope.nuevaEtiqueta);
    });
    
});

app.factory('ETIQUETA',function($rootScope)
{
  var service = {};
  service.etiqueta = null;
    
  service.AgregarEtiqueta = function(origen)
  {
      this.etiqueta = null;
      this.origen = origen;
      $rootScope.$broadcast('AgregarEtiqueta'); 
  };
    
  service.EditarEtiqueta = function(etiqueta)
  {
      this.etiqueta = etiqueta;
      $rootScope.$broadcast('EditarEtiqueta'); 
  };
    
  service.TerminarEtiqueta = function(etiqueta)
  {
      this.etiqueta = etiqueta;
      
      if(this.origen)
      {
          $rootScope.$broadcast('TerminarEtiquetaInformacion');
      }
      else
      {
          $rootScope.$broadcast('TerminarEtiqueta');
      }
      
  };
    
  service.TerminarEditarEtiqueta = function(etiqueta)
  {
      this.etiqueta = etiqueta;
      $rootScope.$broadcast('TerminarEditarEtiqueta'); 
  };
    
  service.GetEtiqueta = function()
  {
      return this.etiqueta;
  };

  return service;
});