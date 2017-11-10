var chamadas = {
    load: function(){
        $('.currentDate').html(dataCompleta);

        var loadChamadas = $('.loadChamadas');
        db.ref('chamadas').on('child_added',function(childSnapshot){
            $('.btnAdicionarChamada').after(`<li class="btnGerenciarChamada" data-case="show" data-value="${childSnapshot.key}">${childSnapshot.val().data} <br /><small> ${childSnapshot.val().qntPresentes} presentes</small></li>`);
        });

        db.ref('chamadas').on('child_removed',function(childSnapshot){
            loadChamadas.find(`[data-value="${childSnapshot.key}"]`).remove();
        });


    },

    visualizar: function(chamId){
        db
            .ref('chamadas')
            .child(chamId)
            .once('value', function(snapshot){
                var descricao = (snapshot.val().descricao == '') ? "Sem descrição" : snapshot.val().descricao;
                $('.case .case-header span').html("Reunião em "+snapshot.val().data);
                $('.case .case-container').html(`
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea class="form-control" rows="3" disabled>${descricao}</textarea>
                    </div>
                    <table class="table table-condensed table-bordered">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody class="tableUsuarios">
                        <tr class="loading"><td><div class="fa fa-circle-o-notch fa-spin"></div></td></tr>
                    </tbody>
                </table>

                <button class="btn btn-fill btn-danger btn-sm btnRemover" value="${snapshot.key}"><div class="fa fa-trash-o"></div> Remover chamada</button>`);

                $.each(snapshot.val().presentes, function(childIndex, childValue){
                    db.ref('users').child(childIndex).on('value',function(result){
                        $('.loading').remove();

                        var presente = (childValue) ? "presente" : "faltou";
                        var sePresente = (childValue) ? "text-success" : "text-danger";

                        $('.tableUsuarios').append(`<tr>
                                    <td>${result.val().nome}</td>
                                    <td class="${sePresente}"><strong>${presente}</strong></td>
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
            presentes[$(this).val()] = true;
            count++;
        });

        $.each($('input[name=presenca]:not(:checked)'),function(){
            presentes[$(this).val()] = false;
        });

        var data = {
            data: dataCompleta,
            descricao: $('.inputDescricao').val(),
            presentes: presentes,
            qntPresentes: count
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
            <table class="table table-condensed table-bordered">
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

    },

    remover: function(chamId){
        db.ref('chamadas/' + chamId).set({}).then(function(){
            cas_e.close();
            $.notify({message: "Chamada removida!"}, {type: "info", timer: 3000});
        });
    },
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

$(document).on('click', '.btnRemover', function(){
    chamadas.remover($(this).val());
});