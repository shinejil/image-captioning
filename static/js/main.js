$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').attr('src', e.target.result); // Update this line
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });
    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling API /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader').hide();
                $('#result').empty();
                showCaptions(data); // Call the showCaptions function to display captions
                $('#result').fadeIn(600);
                console.log('Success!');
            },
        });
    });

        // Function to show captions
        function showCaptions(captions) {
          var captionList = document.getElementById('caption-list');
          captionList.innerHTML = ''; // Clear existing captions

          captions.forEach(function(caption) {
            var listItem = document.createElement('li');
            listItem.textContent = caption;
            captionList.appendChild(listItem);
          });
        }

    });
</script>

{% endblock %}
