Template.FileInput.onRendered(function() {
    var template = this;
    var button = template.find('[' + template.data.inputSettings.button + ']');
    var input = template.find('[' + template.data.inputSettings.input + ']');
    var multiple = template.data.inputSettings.multiple;

    Partup.client.uploader.create({
        buttonElement: button,
        fileInput: input,
        multiple: multiple,
        onFileChange: function(fileInputEvent) {
            template.data.inputSettings.onFileChange(fileInputEvent);
        }
    });
});

