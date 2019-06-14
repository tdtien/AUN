import keys from "../keys";

export default {
    //Common
    [keys.Common.lblError]: 'Error',
    [keys.Common.lblYes]: 'Yes',
    [keys.Common.lblNo]: 'No',
    [keys.Common.lblOK]: 'OK',
    [keys.Common.lblCancel]: 'Cancel',
    [keys.Common.lblDelete]: 'Delete',
    [keys.Common.lblSuccess]: 'Success',
    [keys.Common.lblSet]: 'Set',
    [keys.Common.lblUpload]: 'Upload',
    [keys.Common.lblNotification]: 'Notification',
    [keys.Common.lblNoContent]: 'There is no content.',
    [keys.Common.lblReloadRequest]: 'Pull to refresh.',
    [keys.Common.alertNetworkRequestFail]: 'Connection has been interrupted. Do you want to view SAR offline mode?',
    [keys.Common.alertNetworkRequestSuccess]: 'Connection is ready. Do you want to view SAR online mode?',
    [keys.Common.alertInvalidFileName]: 'Your file name just use alphabet, numbers and underscore.',

    //App
    [keys.App.alertExitApp]: 'Click back again to exit.',

    //Welcome
    [keys.Welcome.lblSarEditor]: 'SAR Editor',
    [keys.Welcome.lblSarViewer]: 'SAR Viewer',
    [keys.Welcome.lblSarEditorDescription]: 'Upload/download file and manage criterion, implications, questions, evidences and more....',
    [keys.Welcome.lblSarViewerDescription]: 'You can review Self-Assessment Report and comment, note in criteria',
    [keys.Welcome.btnSkip]: 'Skip',
    [keys.Welcome.btnNext]: 'Next',
    [keys.Welcome.btnDone]: 'Done',

    //Login
    [keys.Login.lblTitle]: 'AUN Inspection System',
    [keys.Login.lblEmail]: 'Email',
    [keys.Login.lblPassword]: 'Password',
    [keys.Login.btnSignIn]: 'Sign In',
    [keys.Login.toastEmptyEmail]: 'Please enter your email address',
    [keys.Login.toastEmptyPassword]: 'Please enter your password',

    //SideMenu
    [keys.SideMenu.Main.lblSarEditor]: 'SAR Editor',
    [keys.SideMenu.Main.lblSarViewer]: 'SAR Viewer',
    [keys.SideMenu.Main.btnSetting]: 'Setting',
    [keys.SideMenu.Main.btnLogout]: 'LOG OUT',
    [keys.SideMenu.Setting.lblTitle]: 'Setting',
    [keys.SideMenu.Setting.lblLanguage]: 'Language',
    [keys.SideMenu.Setting.lblLanguage]: 'Language',

    //SarExplorer
    [keys.SarExplorer.Main.lblImplication]: 'Implications',
    [keys.SarExplorer.Main.lblQuestion]: 'Questions',
    [keys.SarExplorer.Main.lblEvidenceType]: 'Evidence Types',
    [keys.SarExplorer.Main.lblSubcriterion]: 'Subcriterions',
    [keys.SarExplorer.Main.Title.editor]: 'SAR Editor',
    [keys.SarExplorer.Main.Title.download]: 'Download Offline',
    [keys.SarExplorer.Main.alertNoItemDownload]: 'No item is selected!',
    [keys.SarExplorer.Main.lblDownloadOption]: 'Download offline',
    [keys.SarExplorer.Main.alertDownloadSuccess]: 'Download successful!',
    [keys.SarExplorer.Main.alertDownloadFail]: 'Download failed!',

    [keys.SarExplorer.Comment.alertEmptyComment]: 'Empty comment!',
    [keys.SarExplorer.Comment.alertEmptyNote]: 'Empty note!',
    [keys.SarExplorer.Comment.lblTitle]: 'Content',
    [keys.SarExplorer.Comment.btnSeeMore]: 'See more',
    [keys.SarExplorer.Comment.lblComment]: 'Comment',
    [keys.SarExplorer.Comment.lblNote]: 'Note',
    [keys.SarExplorer.Comment.lblCommentPlaceholder]: 'Add comment...',
    [keys.SarExplorer.Comment.lblNotePlaceholder]: 'Add note...',

    [keys.SarExplorer.AddButton.Main.lblTitle]: 'Please choose how to upload',
    [keys.SarExplorer.AddButton.Main.lblOptionImages]: 'Edit from images in device...',
    [keys.SarExplorer.AddButton.Main.lblOptionLink]: 'Upload from link...',
    [keys.SarExplorer.AddButton.Main.lblOptionEvidence]: 'Upload from PDF file in device...',
    [keys.SarExplorer.AddButton.Main.alertInvalidData]: 'Invalid data. Please check your data input',
    [keys.SarExplorer.AddButton.Main.lblUploadDialogTitle]: 'Set name for doc to upload',
    [keys.SarExplorer.AddButton.Main.lblUploadSuccess]: 'Upload file successful',
    [keys.SarExplorer.AddButton.UploadLinkDialog.lblTitle]: 'Complete information to upload',
    [keys.SarExplorer.AddButton.UploadLinkDialog.lblLinkPlaceholder]: 'Set link...',
    [keys.SarExplorer.AddButton.UploadLinkDialog.lblFileNamePlaceholder]: 'Set file name...',

    [keys.SarExplorer.TextViewer.lblImplication]: 'Implication',
    [keys.SarExplorer.TextViewer.lblQuestion]: 'Question',

    //Merchant
    [keys.Merchant.Main.lblTitle]: 'All Docs',
    [keys.Merchant.Main.lblSearchPlaceholder]: 'Search...',

    [keys.Merchant.MerchantItem.lblDeleteFolder]: 'Delete folder',
    [keys.Merchant.MerchantItem.alertDeleteFolder]: 'Are you sure you want to delete this folder?',

    [keys.Merchant.MerchantDetail.lblDeleteImages]: 'Delete images',
    [keys.Merchant.MerchantDetail.alertDeleteImages]: 'Are you sure you want to delete these images?',
    [keys.Merchant.MerchantDetail.btnSelect]: 'Select',
    [keys.Merchant.MerchantDetail.btnExportPdf]: 'Export to PDF',
    [keys.Merchant.MerchantDetail.lblSelected]: 'selected',
    [keys.Merchant.MerchantDetail.btnSelectAll]: 'Select All',
    [keys.Merchant.MerchantDetail.btnDeselectAll]: 'Deselect All',

    [keys.Merchant.SortList.lblTitle]: 'Sort image to export PDF',
    [keys.Merchant.SortList.alertExportPdfFail]: 'Cannot convert to pdf. Please try again!',
    [keys.Merchant.SortList.alertConvertImagesFail]: 'Cannot convert images to base64!',

    [keys.Merchant.ImageModal.lblDeleteImage]: 'Delete image',
    [keys.Merchant.ImageModal.alertDeleteImage]: 'Are you sure you want to delete this image?',
    [keys.Merchant.ImageModal.lblSaveDialogTitle]: 'Set name for doc',

    [keys.Merchant.Breadcrumb.lblImportImages]: 'Import images',
    [keys.Merchant.Breadcrumb.lblChooseImages]: 'Choose images',
    [keys.Merchant.Breadcrumb.lblSortImages]: 'Sort images',
    [keys.Merchant.Breadcrumb.lblConvertPDF]: 'Convert to PDF',
    [keys.Merchant.Breadcrumb.lblUploadEvidence]: 'Upload evidence',

    [keys.Merchant.CameraButton.lblTitle]: 'Import photo',
    [keys.Merchant.CameraButton.lblTakePhoto]: 'Take Photo...',
    [keys.Merchant.CameraButton.lblChooseImage]: 'Choose from Library...',
    [keys.Merchant.CameraButton.lblChooseMultipleImages]: 'Choose multiple images from Library...',

    //PDFViewer
    [keys.PDFViewer.alertDeleteFolderImages]: 'Upload file successful.\r\nDo you want to delete the image folder?',
    [keys.PDFViewer.btnBack]: 'Back',
    [keys.PDFViewer.btnNext]: 'Next',
    [keys.PDFViewer.lblUploadDialogTitle]: 'Set name for doc to upload',
    [keys.PDFViewer.btnDownload]: 'Download',

    //SarViewer
    [keys.SarViewer.Main.lblTitle]: 'Sar Viewer',
    [keys.SarViewer.Main.lblCategory]: 'Category',

}