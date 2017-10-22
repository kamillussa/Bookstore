$(document).ready(function () {
    //Opis książki    
    $(document).on('click', '.btn-book-show-description', function () {
        var bookID = $(this).data('id');
        var parent = $(this).parent().parent();
        $.ajax({
            url: `${API_HOST}/book/${bookID}`,
            method: 'GET',
            dataType: 'json'
        }).done(function (result) {
            parent.find('.book-description').html(result.success[0].description).show();
        }).fail(function (xhr, cod) {
            console.log(xhr, cod);
        });
    });
    //addBook()
    function addBook(book) {
        var element = `<li class="list-group-item">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <span class="bookTitle">${book.title} - ${book.author.name} ${book.author.surname}</span>
                                <button data-id="${book.id}" class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i>
                                </button>
                                <button data-id="${book.id}" class="btn btn-primary pull-right btn-xs btn-book-show-description"><i class="fa fa-info-circle"></i>
                                </button>
                            </div>
                            <div class="panel-body book-description">${book.description}</div>
                        </div>
                    </li>`;
        $('#booksList').append(element);
        var option = `<option value="${book.id}"> ${book.title} </option>`;
        $('#bookEditSelect').append(option);
    }
    //Submit
    $('#bookAdd').on('submit', function (e) {
        e.preventDefault();
        var title = $('#title').val();
        var description = $('#description').val();
        var author = $('#author_id').val();
        if (title.length === 0 && description.length === 0) {
            return;
        }
        $.ajax({
            url: `${API_HOST}/book`,
            data: {
                title: title,
                description: description,
                author_id: author
            },
            method: "POST",
            dataType: "json"
        }).done(function (result) {
            addBook(result.success[0]);
        }).fail(function (xhr, cod) {
            console.log(xhr, cod);
        });
    });
    //Get books from db
    $.ajax({
        url: `${API_HOST}/book`,
        method: 'GET',
        dataType: 'json'
    }).done(function (result) {
        result.success.forEach((e) => addBook(e));
    }).fail(function (xhr, cod) {
        console.log(xhr, cod);
    });

    //Delete Book
    $(document).on('click', '.btn-book-remove', function () {
        var bookID = $(this).data('id');
        var parent = $(this).parent().parent().parent();
        $.ajax({
            url: `${API_HOST}/book/${bookID}`,
            method: 'DELETE',
            dataType: 'json'
        }).done(function (result) {
            console.log(result.success);
            parent[0].remove();
        }).fail(function (xhr, cod) {
            console.log(xhr, cod);
        });
    });

    //Book edit
    $('#bookEditSelect').on('click', 'option', function () {
        var title = $("#titleEdit").val();
        var description = $("#descriptionEdit").val();
        var bookID = $(this).attr('value');
        $('#bookEdit').css("display", "block");
        $(document).on('submit', function (e) {
            var author = $('#author_id_edit').val();
            e.preventDefault();
            $.ajax({
                url: `${API_HOST}/book/${bookID}`,
                data: {
                    title: title,
                    description: description,
                    author_id: author
                },
                method: 'PATCH',
                dataType: 'json'
            }).done(function (result) {
                console.log(result.success[0]);
                $('#bookEdit').css("display", "none");
            }).fail(function (xhr, cod) {
                console.log(xhr, cod);
            });
        });
    });

    //Add author
    function addAuthor(author) {
        var select = `<option value="${author.id}">${author.name} ${author.surname}</option>`;
        $('#author_id').append(select);
        $('#author_id_edit').append(select);
    }
    //Get authors from db
    $.ajax({
        url: `${API_HOST}/author`,
        method: 'GET',
        dataType: 'JSON'
    }).done(function (result) {
        result.success.forEach((e) => addAuthor(e));
    }).fail(function (xhr, cod) {
        console.log(xhr, cod);
    });
});