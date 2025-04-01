import { useRouter } from 'next/router';

const Order = () => {
    const router = useRouter();
    const { id_sale_invoice } = router.query;
    
    return (
        <div>
            <h1>Chi tiết hóa đơn {id_sale_invoice}</h1>
            {/* Hiển thị chi tiết hóa đơn ở đây */}
        </div>
    );

}

Order.getLayoutWeb = function getLayoutWeb(page) {
    return <>{page}</>;
};

export default Order

