$(document).ready(() => {
    let items = [];
    let itemsRaw = [];

    $.getJSON('/api/books', (data) => {
        itemsRaw = data;
        $.each(data, (i, val) => {
            items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
            return (i !== 14);
        });
        if (items.length >= 15) {
            items.push('<p>...and ' + (data.length - 15) + ' more!</p>');
        }
        $('<ul/>', {
            'class': 'listWrapper',
            html: items.join('')
        }).appendTo('#display');
    });

    let comments = [];
    $('#display').on('click', 'li.bookItem', () => {
        $("#detailTitle").html('<b>' + itemsRaw[this.id].title + '</b> (id: ' + itemsRaw[this.id]._id + ')');
        $.getJSON('/api/books/' + itemsRaw[this.id]._id, (data) => {
            comments = [];
            $.each(data.comments, (i, val) => {
                comments.push('<li>' + val + '</li>');
            });
            comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
            comments.push('<br><button class="btn btn-info addComment" id="' + data._id + '">Add Comment</button>');
            comments.push('<button class="btn btn-danger deleteBook" id="' + data._id + '">Delete Book</button>');
            $('#detailComments').html(comments.join(''));
        });
    });

    $('#bookDetail').on('click', 'button.deleteBook', () => {
        $.ajax({
            url: '/api/books/' + this.id,
            type: 'delete',
            success: (data) => {
                $('#detailComments').html('<p style="color: red;">' + data + '<p><p>Refresh the page</p>');
            }
        });
    });

    $('#bookDetail').on('click', 'button.addComment', () => {
        let newComment = $('#commentToAdd').val();
        $.ajax({
            url: '/api/books/' + this.id,
            type: 'post',
            dataType: 'json',
            data: $('#newCommentForm').serialize(),
            success: (data) => {
                comments.unshift(newComment);
                $('#detailComments').html(comments.join(''));
            }
        });
    });

    $('#newBook').click(() => {
        $.ajax({
            url: '/api/books',
            type: 'post',
            dataType: 'json',
            data: $('#newBookForm').serialize(),
            success: (data) => {
                //update list
            }
        });
    });

    $('#deleteAllBooks').click(() => {
        $.ajax({
            url: '/api/books',
            type: 'delete',
            dataType: 'json',
            data: $('#newBookForm').serialize(),
            success: (data) => {
                //update list
            }
        });
    });

    $(() => {
        $('#commentTest').submit(() => {
            let id = $('#idinputtest').val();
            $(this).attr('action', "/api/books/" + id);
        });
    });

});