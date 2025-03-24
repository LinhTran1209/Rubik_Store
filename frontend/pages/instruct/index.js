import React from "react";


const Instruct = () => {
    return (
        <div className="all__section">
            <div className="all__section-header">
                <span className="all__section-header-text"><a href="/home">Trang chủ</a></span>
                <span><a href="/instruct">Hướng dẫn chơi</a></span>
            </div>

            <div className="all__section-main">
                <div className="all__section-main-title">
                    <span>Hướng dẫn xoay rubik 3x3x3 theo cách đơn giản nhất</span>
                </div>
                <div className="all__section-main-text">
                    <p>
                        Lập phương Rubik (Khối Rubik hay đơn giản là Rubik) là một trò chơi giải đố cơ học được giáo sư kiến trúc, nhà điêu khắc gia người Hungary, Ernő Rubik phát minh vào năm 1974. Các tên gọi sai thường gặp của trò chơi này là Rubik, Rubic và Rubick.
                    </p>
                    <p>
                        Mỗi mặt của phiên bản này có 9 ô vuông và được sơn phủ một trong sáu màu khác nhau, thông thường là trắng, đỏ, vàng, cam, xanh lá cây và xanh dương (một số khối khác thay thế mặt màu trắng bằng màu đen). Bài toán bắt đầu bằng việc xáo trộn tất cả vị trí các ô vuông ở mỗi mặt, tức là các màu sắc xen kẽ nhau. Bài toán chỉ được giải quyết khi mà mỗi mặt của khối là một màu đồng nhất.
                    </p>
                    <p>
                        Có thể nói khối Rubik là một trong những loại đồ chơi bán chạy nhất thế giới. Riêng trong năm 2005, đã có khoảng 300.000.000 khối Rubik được bán ra.
                    </p>
                    <p className="main-text-title">
                        Ký hiệu Rubik 3x3 <br/>
                        <span style={{ fontWeight: 'normal' }}>Để bắt đầu, bạn buộc phải đọc và học thuộc các ký hiệu Rubik 3x3 cơ bản sau:</span>
                    </p>
                    <p>
                        F (Front): mặt trước <br/>
                        R (Right): mặt bên phải <br/>
                        L (Left): mặt bên trái <br/>
                        U (Up): mặt trên <br/>
                        D (Down): mặt dưới <br/>
                        Xoay theo chiều kim đồng hồ: F, R, L, U, D. <br/>
                        Xoay ngược chiều kim đồng hồ: F', R', L', U', D'. <br/>
                    </p>
                    <p>
                        = Tóm lại là xoay ngược chiều kim đồng hồ sẽ có dấu phẩy cạnh chữ cái.
                        <img style={{ display: 'flex', margin: 'auto', width: '100%' }} src="/assets/img-manual/manual1.jpg" alt="Hướng dẫn 1" />
                        Các bước cơ bản để giải 1 khối rubik 3x3
                    </p>
                    <p className="main-text-title">Bước 1 : Tạo dấu thập trắng trên đỉnh </p>
                    <p>
                        Bước đầu tiên cũng là bước đơn giản nhất, đó là tạo dấu thập trắng trên đỉnh của khối Rubik. Bạn chọn màu nào để bắt đầu cũng được, nhưng trong bài hướng dẫn cho người mới này, chúng ta sẽ bắt đầu với mặt trắng trước.
                    </p>
                    <p>
                        Tôi khuyến khích các bạn thử cố gắng giải tầng đầu tiên mà không cần đọc hướng dẫn bên dưới. Lý do là để bạn có thể hiểu được cơ chế hoạt động của khối Rubik, qua đó chuẩn bị tốt hơn cho các bước sau. Bước này không quá khó vì bạn chưa cần để ý quá nhiều các chi tiết khác.
                    </p>
                    <p>
                        Mục tiêu là tạo một dấu thập trắng ở mặt trên và phải chú ý tới màu sắc của các viên trung tâm cạnh bên. Cố gắng không làm xáo trộn các cạnh đã giải quyết xong nhé.
                        <img style={{ display: 'flex', margin: 'auto' }} src="/assets/img-manual/manual2.jpg" alt="Hướng dẫn 2" />
                        Ví dụ:
                        <img style={{ display: 'flex', margin: 'auto', width: '100%' }} src="/assets/img-manual/manual3.jpg" alt="Hướng dẫn 3" />
                    </p>
                    <p className="main-text-title">
                        Bước 2: Ghép các viên góc trắng để hoàn thiện tầng 1
                    </p>
                    <p>
                        Hoàn thiện tầng một không phải là vấn đề gì quá to tát. Cũng giống như trong bước trước, ghép các viên góc trắng có thể dễ dàng được hoàn thành bởi một người bình thường, bằng cách tự nghiệm chỉ sau một thời gian ngắn làm quen. Bước thứ hai này chưa yêu cầu học thuộc các công thức, bạn chỉ cần áp dụng một vài hoán vị ngắn mà thậm chí không cần phải nhớ.
                    </p>
                    <p>
                        Ví dụ về thủ thuật "dấu góc"
                        <img style={{ display: 'flex', margin: 'auto', width: '100%' }} src="/assets/img-manual/manual4.jpg" alt="Hướng dẫn 4" />
                    </p>
                    <p className="main-text-title">
                        Bước 3 : Ghép 4 viên cạnh còn lại để hoàn thiện tầng 2
                    </p>
                    <p>
                        Trước đó, chúng ta có thể tự nghiệm mà không cần bất kỳ công thức nào. Nhưng trong bước 3 này, bạn buộc phải học hai công thức để đưa viên cạnh ở tầng 3 xuống tầng 2 mà không làm hỏng mặt trắng đã hoàn thiện.
                    </p>
                    <p>
                        Giờ thì hãy lật ngược khối Rubik lại để phù hợp cho cách giải của bước này, sau đó xoay tầng trên cùng để viên cạnh khớp với ảnh bên dưới. Có hai công thức xoay rubik 3x3 tầng 2 cần sử dụng, gọi là: thuật toán trái và thuật toán phải.
                    </p>
                    <p>
                        <img style={{ display: 'flex', margin: 'auto', width: '100%' }} src="/assets/img-manual/manual6.jpg" alt="Hướng dẫn 6" />
                        Thuật toán trái
                        <img style={{ display: 'flex', margin: 'auto', width: '100%' }} src="/assets/img-manual/manual6.1.jpg" alt="Hướng dẫn 6.1" />
                    </p>
                    <p className="main-text-title">
                        Bước 4: Tạo dấu thập vàng trên đỉnh
                    </p>
                    <p>
                        Ở bước này, mặc dù chúng ta có 3 trường hợp của tầng 3 là: chỉ có 1 Dot, có 3 Dot hình chữ L, có 3 Dot theo đường thẳng. Nhưng phương pháp ở bước này chỉ cần một công thức đó là: F R U R' U' F'.
                    </p>
                    <p>
                        - Trong trường hợp 1 Dot: chúng ta cần xoay công thức này ba lần
                    </p>
                    <p>
                        - Trong trường hợp 3 Dot chữ L: chúng ta cần xoay hai lần. Lưu ý hướng của chữ L.
                    </p>
                    <p>
                        - Trong trường hợp 3 Dot đường thẳng nằm ngang: chúng ta xoay công thức này 1 lần
                    </p>
                    <p>
                        <img style={{ display: 'flex', margin: 'auto', width: '100%' }} src="/assets/img-manual/manual7.jpg" alt="Hướng dẫn 7" />
                    </p>
                    <p className="main-text-title">
                        Bước 5: Đưa các viên chữ thập màu vàng về đúng vị trí
                    </p>
                    <p>Mục tiêu</p>
                    <p>
                        Sau bước 4, chúng ta đã tạo ra được chữ thập màu vàng ở tầng 3, nhưng có thể vị trí của chúng không đúng. Vì vậy bước này giúp đưa lại chúng về đúng vị trí, tức là các mặt cạnh trùng với màu của viên tâm.
                    </p>
                    <p>Cách thực hiện</p>
                    <p>
                        Quan sát khối Rubik, kiểm tra vị trí của các mảnh cạnh màu vàng cần chuyển đổi. Cầm Rubik sao cho hai cạnh cần hoán đổi với nhau nằm ở mặt trước F và mặt trái L.
                    </p>
                    <p>
                        Thực hiện công thức (R U) (R’ U) (R U2) R’ U để hoán vị giữa cạnh vàng mặt F với cạnh vàng mặt L.
                        <img style={{ width: '100%', display: 'flex', margin: 'auto' }} src="/assets/img-manual/manual8.jpg" alt="Hướng dẫn 8" />
                        Kết quả bước 5,
                        chúng ta sẽ được hình khối rubik như sau:
                        <img style={{ display: 'flex', margin: 'auto' }} src="/assets/img-manual/manual9.jpg" alt="Hướng dẫn 9" />
                    </p>
                    <p className="main-text-title">
                        Bước 6 : Đưa các viên góc màu vàng về đúng vị trí 
                    </p>
                    <p>Mục tiêu, đưa các viên góc màu vàng về đúng vị trí của chúng ( nhưng có thể sai hướng)</p>
                    <p>
                        Cách thực hiện, quan sát xem các viên góc màu vàng có viên nào đang nằm sai vị trí không. Đúng vị trí được hiểu là viên có 3 góc màu: màu vàng và 2 màu còn lại đang nằm ở giao điểm tại 3 cạnh có màu tương ứng ( không nhất thiết trùng màu tâm).
                    </p>
                    <p>
                        Ở bước này, một điều thú vị chúng ta sẽ thấy rằng: sẽ luôn chỉ có 0, 1 hoặc là 4 viên góc ở vị trí đúng.
                    </p>
                    <p>
                        - Nếu có 1 viên góc ở vị trí đúng: Cầm khối Rubik sao cho viên đúng này ở vị trí FRU ( Mặt trước, phía trên, bên trái). Áp dụng công thức: U R U’ L’ U R’ U’ L
                    </p>
                    <p>
                        - Nếu không có viên góc nào ở vị trí đúng: bạn cần thực hiện công thức trên khoảng 2 lần để tạo được 1 góc đúng.
                    </p>
                    <p>
                        - Nếu cả 4 viên góc đúng thì chúc mừng bạn, bạn có thể chuyển ngay tới bước 7
                        <img style={{ display: 'flex', margin: 'auto', width: '100%' }} src="/assets/img-manual/manual10.jpg" alt="Hướng dẫn 10" />
                    </p>
                    <p className="main-text-title">Bước 7: Hoàn thành giải khối Rubik</p>
                    <p>Mục tiêu, hoàn thiện giải khối Rubik bằng cách hoán đổi hướng đúng của các ô góc ở bước 6 nếu như chúng chưa đúng hướng.</p>
                    <p>Cách thực hiện, sau bước 6, nếu các viên góc vô tình quay đúng hướng thì chúc mừng bạn, bạn đã hoàn thành khối Rubik mà không cần đến bước 7. Còn nếu không bạn cần thực hiện như sau:</p>
                    <p>
                        - Chọn hướng cầm Rubik sao cho 1 viên góc màu vàng bị sai hướng nằm ở mặt trước, phía trên, bên phải như vị trí đánh dấu như bên dưới, tức vị trí FRU.
                        <img style={{ display: 'flex', margin: 'auto' }} src="/assets/img-manual/manual11.jpg" alt="Hướng dẫn 11" />
                    </p>
                    <p>
                        - Thực hiện chẵn lần (2 hoặc 4 lần) công thức sau: R’ D’ R D để định hướng đúng góc này, vì khi thực hiện công thức này, mặt màu vàng sẽ xoay tại chỗ theo chiều kim đồng hồ. Dừng thực hiện khi mặt vàng ở đúng vị trí. Việc xáo trộn các tầng 1, 2 không có vấn đề gì cả vì chúng sẽ tự về vị trí đúng sau khi bạn giải xong tất cả các góc sai.
                        <img style={{ display: 'flex', margin: 'auto' }} src="/assets/img-manual/manual12.jpg" alt="Hướng dẫn 12" />
                    </p>
                    <p>
                        - Dùng U / U' để chuyển các ô vàng sai hướng còn lại đến vị trí đánh dấu FRU và tiếp tục áp dụng lại công thức trên cho đến khi tất cả các ô góc vàng được giải.
                        Lưu ý: Ngoại trừ viên góc đầu tiên, chỉ sử dụng U và U' để di chuyển các góc còn lại tới vị trí FRU.
                        Kết thúc : Khi tất cả các góc được định hướng chuẩn, thì bạn đã giải xong khối Rubik! Chúc mừng bạn đã giải được khối Rubik Cube 3x3x3.
                    </p>
                    <br/><br/>
                </div>
            </div>
        </div>
    );
};

Instruct.getLayoutWeb = function getLayoutWeb(page) {
    return (
        { page }
    );
};

export default Instruct;