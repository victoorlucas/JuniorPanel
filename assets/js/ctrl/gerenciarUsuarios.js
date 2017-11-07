//Este objeto agrupa todas as funções referentes ao controller de gerencia de usuários
var gerenciarUsuarios = {

	load: function(){
		var tableUsuarios = $('.tableUsuarios');

		$('.case .case-header span').html(`<i class="fa fa-circle-o-notch fa-spin"></i>`);
		$('.case .case-container').html(`<i class="fa fa-circle-o-notch fa-spin"></i>`);

		tableUsuarios.html(`<span class="loading"><i class="fa fa-circle-o-notch fa-spin"></i></span>`);

		db.ref('users').orderByChild("nome").on('value',function(snapshot){
			if(snapshot.val() != null){
				tableUsuarios.html(' ');

				snapshot.forEach(function(childSnapshot){
					if(childSnapshot.val().status != 'bloqueado' && childSnapshot.val().status != 'removido'){
						tableUsuarios.append(`
						<tr>
							<th scope="row">${childSnapshot.val().nome}</th>
							<td>${childSnapshot.val().matricula}</td>
							<td class="text-right">
								<button class="btn btn-fill btn-sm btnGerenciarUsuario" value="${childSnapshot.key}" data-case="show">Visualizar ${childSnapshot.val().nome}</button>
							</td>
						</tr>`);
					}
				});
			}else{
				tableUsuarios.html(`<span>Nenhum usuário cadastrado</span>`);
			}
		});

		$()
	},

	gerenciar: function(userUid){
		// if(localStorage.currentUid == userUid){
		// 	cas_e.close();
		// 	loadPage('perfil');
		// }else{

		db
		.ref('users')
		.child(userUid)
		.on('value', function(snapshot){
			var dataSaida = (snapshot.val().dataSaida == undefined) ? "ainda ativo" : snapshot.val().dataSaida;
			$('.case .case-header span').html("Visualizar "+snapshot.val().nome);
			$('.case .case-container').html(`
				<button class="btn btn-default btn-fill btn-sm" value="${userUid}"><div class="fa fa-pencil-square-o"></div> Editar</button>
				<button class="btn btn-default btn-fill btn-sm" value="${userUid}"><div class="fa fa-lock"></div> Bloquear</button>
				<button class="btn btn-default btn-fill btn-sm btnRemoverUsuario" value="${userUid}"><div class="fa fa-ban"></div> Excluir</button>

				<br /><br />

				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label>Nome</label>
							<input class="form-control inputNome" value="${snapshot.val().nome}" placeholder="Nome" disabled/>
						</div>
					</div>

					<div class="col-md-6">
						<div class="form-group">
							<label>Matricula</label>
							<input class="form-control inputMatricula" value="${snapshot.val().matricula}" placeholder="Nome" disabled/>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label>CPF</label>
							<input class="form-control inputCpf" value="${snapshot.val().cpf}" placeholder="Nome" disabled/>
						</div>
					</div>

					<div class="col-md-6">
						<div class="form-group">
							<label>Whatsapp</label>
							<input class="form-control inputWhatsapp" value="${snapshot.val().whatsapp}" placeholder="Nome" disabled/>
						</div>
					</div>
				</div>

				
				<strong>Curso</strong>: ${snapshot.val().curso} <br />
				<strong>Semestre</strong>: ${snapshot.val().semestre} <br />
				<strong>Data de Admissão</strong>: ${snapshot.val().dataAdmissao} <br />
				<strong>Data de saída</strong>: ${dataSaida} <br />
				<strong>Cargo</strong>: ${snapshot.val().cargo}
			`);
		});

	},

	editar: function(userUid){

	},

	bloquear: function(userUid){

	},

	remover: function(userUid){
		// if(userToDeleteuid != undefined){
		// 	db
		// 	.ref('users')
		// 	.child(userToDeleteuid)
		// 	.set(null);

		// 	userToDeleteuid = undefined;
		// }else{
		// 	$.notify({message: "Não foi possível deletar este usuário!"}, {type: 'info', timer: 2000});
		// }
		alert("saporra");
	},


}


gerenciarUsuarios.load();

$(document).on('click','.btnEditarUsuario',function(){
	gerenciarUsuarios.editar(this.value);
});

$(document).on('click','.btnBloquearUsuario',function(){
	gerenciarUsuarios.bloquear(this.value);
});

$(document).on('click','.btnRemoverUsuario',function(){
	gerenciarUsuarios.remover(this.value);
});

$(document).on('click','.btnGerenciarUsuario', function(){
	verificaNivel(0, gerenciarUsuarios.gerenciar(this.value));
});