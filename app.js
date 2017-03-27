$(document).ready(function(){
  api_root = "https://serene-springs-19599.herokuapp.com/"
  // Utility Methods

  function reset_form(form_id){
    $(form_id)[0].reset()
  }


  function noteDisplay(note){
    return `
          <div class="media" id="${note.id}">
            <div class="media-body">
            <h6>${note.title}<h6>
              <p>${note.body}</p>
              <p><small> Tags: ${tagDisplay(note)}</small></p>
              <p><small>Posted by ${anon(note)} <a href="#${note.id}" class="note_show">${moment(note.created_at).fromNow()}</a></small></p>
            </div>
          </div>
          `
  }
  function anon(note){
    if (note.user === null){
      return "Anonymous"
    }
    else {
      return note.user.username
      }

  }

  function tagDisplay(note){
    return note.tags.map(function(tag){
      return `<a href="${tag.name}" class="tag_show">${tag.name}</a>`
    }).join(", ")
  }

  // if tag is clicked do populateNotes: empty out note list and then go to api_root + 'api/notes/tag/${tag.name}'

  $(document).on('click', '.tag_show', function(ev){
    ev.preventDefault()
    tag = $(ev.target).attr("href")
    populateTagNotes("https://serene-springs-19599.herokuapp.com/api/notes/tag/" + tag)
    $('#header').empty().append(`: ${tag}`)
  })

  function populateNotes(){
    $('#noteList').empty()
    $.getJSON(api_root + 'api/notes')
      .done(function(response){
        response.notes.forEach(function(note){
          $('#noteList').append(
            noteDisplay(note)
          )
        })
        if(window.location.hash){
          $('#modalOne .modal-body').html($(location.hash).html())
          $('#modalOne').modal('show')
        }
      })
  }

  function populateTagNotes(tag) {
    $('#noteList').empty()
    $.getJSON(tag)
      .done(function(response){
        response.tag.notes.forEach(function(note){
          $('#noteList').append(
            noteDisplay(note)
          )
        })
      })
    }


  $('#postNote').on('submit', function(ev){
    ev.preventDefault()
    $.post(api_root + "api/notes", $(this).serialize())
      .done(function(note){
        $('#noteList').prepend(
          noteDisplay(note.note)
        )
        reset_form('#postNote')
      })
  })

  // function openNoteModal() {
  //   if(window.location.hash) {
  //     noteId = window.location.hash
  //       $("#modalOne .modal-body").html(noteDisplay(noteId))
  //       $("#modalOne").modal("show")
  //   }
  // }

 populateNotes()
})
