global = {
	msg(message,type = 'info',timer = 3000){
		$.notifyClose();
		$.notify({message: message}, {type: type, timer: timer, newest_on_top: true});
	},

	loadPage(page, nivel = null){
		$('li').removeClass('active');

		if(nivel != null){
			db.ref('users').child(localStorage.currentUid).once('value', user => {
				global.loadPage((user.val().cargo == nivel) ? page : 'error401');
			});
		}else{
			$.ajax(`assets/views/${page}.html`)
				.done(html => {
					$('.loadPage').html(html);
				})
				.fail(() => {
					global.loadPage('error404');
				});
		}

		localStorage.removeItem('paginaAnterior');
		localStorage.paginaAnterior = localStorage.currentPage;
		localStorage.removeItem('currentPage');
		localStorage.currentPage = page;
	},

	verificaNivel(nivel){
		db.ref('users').child(localStorage.currentUid).once('value',user => {
			if(user.val().cargo != nivel)
				global.loadPage('error401');
		});
	},

	logout(){
		auth.signOut().then(() => {
			localStorage.removeItem('currentPage').removeItem('currentUid');
			location.href="login.html";
		});
	}
};

Object.freeze(global);



const date = new Date();
const day = (date.getDate() < 10) ? "0"+date.getDate() : date.getDate();
const dataCompleta = day+"/"+date.getMonth()+"/"+date.getFullYear();

const cargos = {
		"Diretor": 0,
		"Gerente de negócios": 0,
		"Coordenador de projetos": 0,
		"Analista/Programador": 1,
		"Designer": 1,
		"Analista de sistemas": 1
};

$(() => {
	$(document).tooltip({
    	selector: '[data-toggle="tooltip"]'
	});

	$(document).on('click touchend', '.selectorPage', function(e){
		var page = $(this).data('page');
		var page = page.split("_");

		if(page[1] == 'i')
			global.loadPage(page[0], 0);
		else
			global.loadPage(page[0]);

		$(this).addClass('active');
	});

	$(document).on('click','[data-page=sair]',e => {
		e.preventDefault();
		global.logout();
	});


	//REFATORAR -> CODIGO VINDO DE index.js
	auth.onAuthStateChanged(function(user) {
		if (!user) {
			location.href="login.html";
		}else{
			db
				.ref('users')
				.child(localStorage.currentUid)
				.on('value', function(snapshot){
					if(snapshot.val() != null){
						$('.titleBarNome').html(snapshot.val().nome);
					}else{

					global.loadPage('perfil');
					$('[data-page=perfil]').addClass('active');
					$('.titleBarNome').html(user.email);
					}
				})
		}
	});

	global.loadPage('inicio');
	$('[data-page=inicio]').addClass('active');

});