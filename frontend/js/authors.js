$(document).ready(function () {
    
    // Add new author to db
    var addForm = $('#authorAdd');
    $('#authorAdd').on('submit', function(e) {
        e.preventDefault();
        var name = addForm.find('#name').val();
        var surname = addForm.find('#surname').val();
        if (name.length === 0 && surname.length === 0) {
            return;
        }
        $.ajax ({
            url: `${API_HOST}/author`,
            data: {
                name: name,
                surname: surname
            },
            type: 'POST',
            dataType: 'JSON'
        }).done(function (result) {
            console.log(result.success[0]);
            addAuthor(result.success[0]);
        }).fail(function (xhr, cod) {
            console.log(xhr, cod);
        });
    });
    
    //Add author to DOM
    function addAuthor(author) {
        var element = `<li class="list-group-item">
                            <div class="panel panel-default">
                                <div class="panel-heading"><span class="authorTitle">${author.name} ${author.surname}</span>
                                    <button data-id="${author.id}" class="btn btn-danger pull-right btn-xs btn-author-remove"><i class="fa fa-trash"></i></button>
                                </div>
                            </div>
                        </li>`;
        $('#authorsList').append(element);
        var option = `<option value="${author.id}">${author.name} ${author.surname}</option>`;
        $('#authorEditSelect').append(option);
    }
    
    //Get author from db
    $.ajax({
        url: `${API_HOST}/author`,
        method: 'GET',
        dataType: 'JSON'
    }).done(function (result) {
        console.log(result.success);
        result.success.forEach((e) => addAuthor(e));
    }).fail(function (xhr, cod) {
        console.log(xhr, cod);
    });
    
    //Delete author from DOM & db
    $(document).on('click', '.btn-author-remove', function () {
        var authorId = $(this).data('id');
        var parent = $(this).parent().parent().parent();
        $.ajax({
            url: `${API_HOST}/author/${authorId}`,
            method: 'DELETE',
            dataType: 'JSON'
        }).done(function (result) {
            console.log(result.success);
            parent[0].remove();
        }).fail(function (xhr, cod) {
            console.log(xhr, cod);
        });
    });
    
    
    //Author edit
    $(document).on('click', 'option', function () {
        var name = $("#nameEdit").val();
        var surname = $("#surnameEdit").val();
        var authorId = $(this).attr('value');
        $('#authorEdit').css("display", "block");
        $(document).on('submit', function (e) {
            e.preventDefault();
            $.ajax({
                url: `${API_HOST}/author/${authorId}`,
                data: {
                    name: name,
                    surname: surname
                },
                method: 'PATCH',
                dataType: 'JSON'
            }).done(function (result) {
               console.log(result.success[0]);
               $('#authorEdit').css("display", "none");
               $("#authorsList").toggle().toggle();
            }).fail(function (xhr, cod) {
                console.log(xhr, cod);
            });
        });
    });
    
});