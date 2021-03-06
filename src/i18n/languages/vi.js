import keys from "../keys";

export default {
    //Common
    [keys.Common.lblError]: 'Lỗi',
    [keys.Common.lblYes]: 'Có',
    [keys.Common.lblNo]: 'Không',
    [keys.Common.lblOK]: 'Đồng ý',
    [keys.Common.lblCancel]: 'Hủy',
    [keys.Common.lblDelete]: 'Xóa',
    [keys.Common.lblSuccess]: 'Thành công',
    [keys.Common.lblSet]: 'Xong',
    [keys.Common.lblUpload]: 'Tải lên',
    [keys.Common.lblNotification]: 'Thông báo',
    [keys.Common.lblNoContent]: 'Chưa có dữ liệu.',
    [keys.Common.lblReloadRequest]: 'Kéo xuống để tải lại.',
    [keys.Common.alertNetworkRequestFail]: 'Kết nối bị gián đoạn. Bạn có muốn xem SAR ở chế độ ngoại tuyến?',
    [keys.Common.alertNetworkRequestSuccess]: 'Kết nối đã sẵn sàng. Bạn có muốn xem SAR ở chế độ trực tuyến?',
    [keys.Common.alertInvalidFileName]: 'Tên tập tin chỉ được dùng bảng chữ cái, số và dấu gạch dưới.',

    //App
    [keys.App.alertExitApp]: 'Nhấn back thêm một lần nữa để thoát.',

    //Welcome
    [keys.Welcome.lblSarEditor]: 'Trình chỉnh sửa SAR',
    [keys.Welcome.lblSarViewer]: 'Trình xem SAR',
    [keys.Welcome.lblSarEditorDescription]: 'Tải lên / tải xuống các tập tin và quản lý các tiêu chí, nội hàm, câu hỏi, minh chứng....',
    [keys.Welcome.lblSarViewerDescription]: 'Bạn có thể xem lại Báo cáo tự đánh giá và bình luận, ghi chú trong các tiêu chí',
    [keys.Welcome.btnSkip]: 'Bỏ qua',
    [keys.Welcome.btnNext]: 'Tiếp',
    [keys.Welcome.btnDone]: 'Xong',

    //Login
    [keys.Login.lblTitle]: 'Hệ thống kiểm định AUN',
    [keys.Login.lblEmail]: 'Email',
    [keys.Login.lblPassword]: 'Mật khẩu',
    [keys.Login.btnSignIn]: 'Đăng nhập',
    [keys.Login.toastEmptyEmail]: 'Vui lòng nhập email của bạn',
    [keys.Login.toastEmptyPassword]: 'Vui lòng nhập mật khẩu của bạn',

    //SideMenu
    [keys.SideMenu.Main.lblSarEditor]: 'Trình chỉnh sửa SAR',
    [keys.SideMenu.Main.lblSarViewer]: 'Trình xem SAR',
    [keys.SideMenu.Main.btnLogout]: 'ĐĂNG XUẤT',
    [keys.SideMenu.Main.btnSetting]: 'Cấu hình',
    [keys.SideMenu.Setting.lblTitle]: 'Cấu hình',
    [keys.SideMenu.Setting.lblLanguage]: 'Ngôn ngữ',

    //SarExplorer
    [keys.SarExplorer.Main.lblImplication]: 'Nội hàm',
    [keys.SarExplorer.Main.lblQuestion]: 'Câu hỏi chẩn đoán',
    [keys.SarExplorer.Main.lblEvidenceType]: 'Nguồn minh chứng',
    [keys.SarExplorer.Main.lblSubcriterion]: 'Tiêu chí',
    [keys.SarExplorer.Main.Title.editor]: 'Trình chỉnh sửa SAR',
    [keys.SarExplorer.Main.Title.download]: 'Tải xuống',
    [keys.SarExplorer.Main.alertNoItemDownload]: 'Không có mục nào được chọn!',
    [keys.SarExplorer.Main.lblDownloadOption]: 'Tải xuống',
    [keys.SarExplorer.Main.alertDownloadSuccess]: 'Tải xuống thành công!',
    [keys.SarExplorer.Main.alertDownloadFail]: 'Tải xuống thất bại!',
    [keys.SarExplorer.Main.lblVersionEditing]: 'Đang biên soạn...',
    [keys.SarExplorer.Main.lblVersionRelease]: 'Đã phát hành - Phiên bản',

    [keys.SarExplorer.Comment.alertEmptyComment]: 'Bình luận trống!',
    [keys.SarExplorer.Comment.alertEmptyNote]: 'Ghi chú trống!',
    [keys.SarExplorer.Comment.alertReloadCommentNote]: 'Kết nối đã sẵn sàng. Bạn có muốn tải lại bình luận và ghi chú?',
    [keys.SarExplorer.Comment.lblTitle]: 'Nội dung',
    [keys.SarExplorer.Comment.btnSeeMore]: 'Xem thêm',
    [keys.SarExplorer.Comment.lblComment]: 'Bình luận',
    [keys.SarExplorer.Comment.lblNote]: 'Ghi chú',
    [keys.SarExplorer.Comment.lblCommentPlaceholder]: 'Viết bình luận...',
    [keys.SarExplorer.Comment.lblNotePlaceholder]: 'Viết ghi chú...',

    [keys.SarExplorer.AddButton.Main.lblTitle]: 'Chọn cách tải lên',
    [keys.SarExplorer.AddButton.Main.lblOptionImages]: 'Chỉnh sửa từ hình ảnh trong thiết bị...',
    [keys.SarExplorer.AddButton.Main.lblOptionLink]: 'Tải lên bằng đường dẫn...',
    [keys.SarExplorer.AddButton.Main.lblOptionEvidence]: 'Tải lên bằng tập tin PDF trong thiết bị...',
    [keys.SarExplorer.AddButton.Main.alertInvalidData]: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại dữ liệu nhập vào',
    [keys.SarExplorer.AddButton.Main.lblUploadDialogTitle]: 'Đặt tên cho tập tin',
    [keys.SarExplorer.AddButton.Main.lblUploadSuccess]: 'Tải lên thành công',
    [keys.SarExplorer.AddButton.UploadLinkDialog.lblTitle]: 'Hoàn thành các thông tin sau',
    [keys.SarExplorer.AddButton.UploadLinkDialog.lblLinkPlaceholder]: 'Nhập đường dẫn...',
    [keys.SarExplorer.AddButton.UploadLinkDialog.lblFileNamePlaceholder]: 'Nhập tên tập tin...',

    [keys.SarExplorer.TextViewer.lblImplication]: 'Nội hàm',
    [keys.SarExplorer.TextViewer.lblQuestion]: 'Câu hỏi chẩn đoán',

    //Merchant
    [keys.Merchant.Main.lblTitle]: 'Tài liệu',
    [keys.Merchant.Main.lblSearchPlaceholder]: 'Tìm kiếm...',

    [keys.Merchant.MerchantItem.lblDeleteFolder]: 'Xóa thư mục',
    [keys.Merchant.MerchantItem.alertDeleteFolder]: 'Bạn có chắc bạn muốn xóa thư mục này?',

    [keys.Merchant.MerchantDetail.lblDeleteImages]: 'Xóa hình ảnh',
    [keys.Merchant.MerchantDetail.alertDeleteImages]: 'Bạn có chắc bạn muốn xóa các hình này?',
    [keys.Merchant.MerchantDetail.btnSelect]: 'Chọn',
    [keys.Merchant.MerchantDetail.btnExportPdf]: 'Xuất thành PDF',
    [keys.Merchant.MerchantDetail.lblSelected]: 'lựa chọn',
    [keys.Merchant.MerchantDetail.btnSelectAll]: 'Chọn tất cả',
    [keys.Merchant.MerchantDetail.btnDeselectAll]: 'Bỏ chọn tất cả',

    [keys.Merchant.SortList.lblTitle]: 'Sắp xếp ảnh',
    [keys.Merchant.SortList.alertExportPdfFail]: 'Không thể xuất thành file PDF!\r\n Xin vui lòng thử lại.',
    [keys.Merchant.SortList.alertConvertImagesFail]: 'Không thể chuyển ảnh thành dạng base64!\r\n Xin vui lòng thử lại.',

    [keys.Merchant.ImageModal.lblDeleteImage]: 'Xóa hình ảnh',
    [keys.Merchant.ImageModal.alertDeleteImage]: 'Bạn có chắc bạn muốn xóa hình ảnh này?',
    [keys.Merchant.ImageModal.lblSaveDialogTitle]: 'Đặt tên cho tập tin',

    [keys.Merchant.Breadcrumb.lblImportImages]: 'Thêm ảnh',
    [keys.Merchant.Breadcrumb.lblChooseImages]: 'Chọn ảnh',
    [keys.Merchant.Breadcrumb.lblSortImages]: 'Sắp xếp ảnh',
    [keys.Merchant.Breadcrumb.lblConvertPDF]: 'Chuyển thành PDF',
    [keys.Merchant.Breadcrumb.lblUploadEvidence]: 'Tải lên',

    [keys.Merchant.CameraButton.lblTitle]: 'Thêm ảnh',
    [keys.Merchant.CameraButton.lblTakePhoto]: 'Chụp ảnh...',
    [keys.Merchant.CameraButton.lblChooseImage]: 'Chọn từ bộ sưu tập...',
    [keys.Merchant.CameraButton.lblChooseMultipleImages]: 'Chọn nhiều ảnh từ bộ sưu tập...',

    //PDFViewer
    [keys.PDFViewer.alertDeleteFolderImages]: 'Tải lên thành công.\r\nBạn có muốn xóa thư mục hình ảnh này?',
    [keys.PDFViewer.btnBack]: 'Trước',
    [keys.PDFViewer.btnNext]: 'Sau',
    [keys.PDFViewer.lblUploadDialogTitle]: 'Đặt tên cho tập tin',
    [keys.PDFViewer.btnDownload]: 'Tải xuống',

    //SarViewer
    [keys.SarViewer.Main.lblTitle]: 'Trình xem SAR',
    [keys.SarViewer.Main.lblCategory]: 'Danh mục',

}