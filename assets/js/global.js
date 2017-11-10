function loadPage(page){
	// if(localStorage.currentPage != page && page !=perfil){
		$('li').removeClass('active');

		$.ajax({
			url: 'assets/views/'+page+'.html',
			beforeSend: function(){
				$('.sidebar').collapse("hide");
				$('.loadingPage').show();
			},
			success: function(html){
				$('.case .case-footer').fadeOut();
				cas_e.close();
				$.notifyClose();
				$('.loadingPage').hide();
				$('.loadPage').html(html);
			}, error: function(){
				loadPage('inicio');
				$.notify({message: "Página "+page+" não existe!"}, {type: 'danger', timer: 3000,newest_on_top: true});
			}
		});

		localStorage.removeItem('paginaAnterior');
		localStorage.paginaAnterior = localStorage.currentPage;
		localStorage.removeItem('currentPage');
		localStorage.currentPage = page;
	// }
}
var date = new Date();
var dia = (date.getDate() < 10) ? "0"+date.getDate() : date.getDate();
var dataCompleta = dia+"/"+date.getMonth()+"/"+date.getFullYear();

var cargos = {
		"Diretor": 0,
		"Gerente de negócios": 0,
		"Coordenador de projetos": 0,
		"Analista/Programador": 1,
		"Designer": 1,
		"Analista de sistemas": 1
};

function verificaNivel(nivel, func){
	db.ref('users').child(localStorage.currentUid).once('value',function(user){
		if(user.val().cargo == nivel){
			func;
		}else{
			cas_e.close();
			loadPage('inicio');
			$.notify({message: "Função indisponível para seu usuário!"},{type: 'danger', timer: 3000});
		}
	});
}

$(function(){
	var body = $('body');

	$('body').tooltip({
    	selector: '[data-toggle="tooltip"]'
	});

	$(document).on('click touchstart','[data-page=inicio]',function(){
		loadPage('inicio');
		$(this).addClass('active');
	});

	$(document).on('click','[data-page=funcionalidades]',function(){
		loadPage('funcionalidades');
		$(this).addClass('active');
	});

	$(document).on('click','[data-page=gerenciarUsuarios]',function(){
		loadPage('gerenciarUsuarios');
	});

	$(document).on('click','[data-page=alterarSenha]',function(){
		loadPage('alterarSenha');
	});

	$(document).on('click','[data-page=perfil]',function(){
		loadPage('perfil');
		$(this).addClass('active');
	});

	$(document).on('click','[data-page=voltarPagina]',function(){
		loadPage(localStorage.paginaAnterior);
	});

	$(document).on('click','[data-page=adicionarUsuario]',function(){
		verificaNivel(0,loadPage('adicionarUsuario'));
	});

	$(document).on('click','[data-page=chamadas]',function(){
		loadPage('chamadas');
	});

	// $(document).on('click','.navbar-toggle', function(){
	// 	if($(this).attr('aria-expanded') == 'true'){
	// 		$(this).html(`<div class="fa fa-times"></div>`);
	// 	}else{
	// 		$(this).html(`<div class="fa fa-bars"></div>`);
	// 	}
	// });

	$('.sairBtn').on('click',function(){
		logout();
	});


	// $(document.body).on("keydown", this, function (event) {
	//     if (event.keyCode == 116) {
	//         loadPage(localStorage.currentPage);
	// 		event.preventDefault();
	//     }
	// }); <- quando clica no botão f5



});

//locais guardados -> currentPage, currentUid

function logout(){
	auth.signOut().then(function(){

		localStorage.removeItem('currentPage');
		localStorage.removeItem('currentUid');

		location.href="login.html"

	}, function(error) {
		console.log(error);
		location.href="login.html"
	});
}