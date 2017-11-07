var date = new Date();
var dia = (date.getDate() < 10) ? "0"+date.getDate() : date.getDate();
var dataCompleta = dia+"/"+date.getMonth()+"/"+date.getFullYear();

var chamadas = {
    load: function(){
        $('.currentDate').html(dataCompleta);

        var loadChamadas = $('.loadChamadas');
        db.ref('chamadas').on('child_added',function(childSnapshot){
            $('.loading').remove();
            loadChamadas.append(`<li class="btnGerenciarChamada" data-case="show" data-value="${childSnapshot.key}">${childSnapshot.val().data} <br /><small> presentes</small></li>`);
        });

        db.ref('chamadas').on('child_removed',function(childSnapshot){
            $('.loading').remove();
            loadChamadas.find(`[data-value="${childSnapshot.key}"]`).remove();
        });


    },

    visualizar: function(chamId){
        db
            .ref('chamadas')
            .child(chamId)
            .once('value', function(snapshot){
                var descricao = (snapshot.val().descricao == '') ? "<i>Sem descrição</i>" : snapshot.val().descricao;
                $('.case .case-header span').html("Reunião em "+snapshot.val().data);
                $('.case .case-container').html(`
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea class="form-control" rows="3" disabled>${descricao}</textarea>
                    </div>
                    <table class="table table-condensed table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Presentes</th>
                        </tr>
                    </thead>
                    <tbody class="tableUsuarios">
                        <tr class="loading"><td><div class="fa fa-circle-o-notch fa-spin"></div></td></tr>
                    </tbody>
                </table>`);

                // <button class="btn btn-fill btn-default btn-sm"><div class="fa fa-trash-o"></div> Apagar chamada</button>

                $.each(snapshot.val().presentes, function(childIndex, childValue){
                    db.ref('users').child(childIndex).once('value',function(result){
                        $('.loading').remove();
                        $('.tableUsuarios').append(`<tr>
                                    <td>${result.val().nome}</td>
                                </tr>`);
                    });
                });
            });
    },

    adicionar: function(data){
        
        var novaChamada = db.ref('chamadas').push();
        novaChamada.set(data).catch(function(error){
            console.log(error.code);
        })
        .then(function(handle){
            $.notify({message: "Chamada adicionada com sucesso!"}, {type: 'info', timer: 5000});
        });
    },

    verificar: function(){
        cas_e.close();
        var presentes = {};
        var count = 0;
        $.each($('input[name=presenca]:checked'),function(){
            // presentes.push({ [$(this).val()]: true });
            presentes[$(this).val()] = true;
            count++;
        });

        var data = {
            data: dataCompleta,
            descricao: $('.inputDescricao').val(),
            presentes: presentes
        };

        chamadas.adicionar(data);
        // console.log(presentes);
    },

    abrirAdicionar: function(){
        $('.case .case-header span').html("Nova chamada em "+dataCompleta);
        $('.case .case-container').html(`
            <div class="form-group">
                <textarea class="form-control inputDescricao" placeholder="Descrição da reunião" rows="3"></textarea>
            </div>
            <table class="table table-condensed table-striped table-hover">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Matricula</th>
                        <th class="text-center">Presente</th>
                    </tr>
                </thead>
                <tbody class="tableUsuarios"></tbody>
            </table>
            <button class="btn btn-fill btn-default btnAdicionar">Adicionar chamada</button>
        `);

        db.ref('users').on('value',function(snapshot){
            if(snapshot != null){
                snapshot.forEach(function(childSnapshot) {
                    $('.tableUsuarios').append(`
                    <tr>
                        <td>${childSnapshot.val().nome}</td>
                        <td>${childSnapshot.val().matricula}</td>
                        <td class="text-center">
                                <label><input type="checkbox" value="${childSnapshot.key}" name="presenca"></label>
                        </td>
                    </tr>
                `);
                });
            }else{
                cas_e.hide();
                $.notify({message: 'Um erro ocorreu, por favor tente novamente mais tarde.'}, {type: 'danger', timer: 3000, newest_on_top: true});
            }
        });

    }
}

chamadas.load();

$(document).on('click', '.btnGerenciarChamada', function(){
    chamadas.visualizar(this.dataset.value);
});

$(document).on('click', '.btnAdicionarChamada', function(){
    chamadas.abrirAdicionar();
});

$(document).on('click', '.btnAdicionar', function(){
    chamadas.verificar();
});