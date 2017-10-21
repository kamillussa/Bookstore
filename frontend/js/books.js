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
        });
    });
    //addBook()
    function addBook(book) {
        var element = `<li class="list-group-item">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <span class="bookTitle">${book.title}</span>
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
        $('#authorEditSelect').append(option);
    }
    //Submit
    $('#bookAdd').on('submit', function (e) {
        e.preventDefault();
        var title = $('#title').val();
        var description = $('#description').val();
        if (title.length === 0 && description.length === 0) {
            return;
        }
        $.ajax({
            url: `${API_HOST}/book`,
            data: {
                title: title,
                description: description
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
        });
    });
    
    //Book edit
    $(document).on('click', 'option', function () {
        var title = $("#titleEdit").val();
        var description = $("#descriptionEdit").val();
        var bookID = $(this).attr('value');
        $('#bookEdit').css("display", "block");
        $(document).on('submit', function (e) {
            e.preventDefault();
            $.ajax({
                url: `${API_HOST}/book/${bookID}`,
                data: {
                    title: title,
                    description: description
                },
                method: 'PATCH',
                dataType: 'json'
            }).done(function (result) {
               console.log(result.success[0]);
               $('#bookEdit').css("display", "none");
            });
        });
    });
});