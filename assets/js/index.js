$(function() {
    auth.onAuthStateChanged(function(user) {
      if (!user) {
        location.href="login.html";
      }else{
      	db
      		.ref('users/'+localStorage.currentUid)
      		.on('value', function(snapshot){
      			if(snapshot.val() != null){
      				$('.titleBarNome').html(snapshot.val().nome);
      			}else{

      				$.notify({
		                message: "Por favor, complete seu perfil!"
		            }, {
		                type: 'danger',
		                timer: 0
		            });

      				loadPage('perfil');
					$('[data-page=perfil]').addClass('active');
					$('.titleBarNome').html(user.email);
      			}
      		})
      }
    });

    loadPage('inicio');
	$('[data-page=inicio]').addClass('active');



});