import React from 'react';

const RequestSidebar: React.FC = () => {
    return (
        <div className="h-[475px] sticky top-20 text-default-500">
            {/* Gizlilik Politikası Uyumluluğu */}
            <div className="bg-default-100 p-4 rounded-lg shadow mb-2">
                <h4 className="text-lg font-semibold mb-2">Gizlilik Politikası</h4>
                <p className="text-sm text-default-900">
                    - Eklediğiniz kitap, platformun <b>gizlilik politikası</b> ile uyumlu olmalıdır.
                    <br />
                    - Yasa dışı veya etik dışı içerikler kabul edilmemektedir.
                </p>
            </div>
            {/* Doğru Bilgiler */}
            <div className="bg-default-100 p-4 rounded-lg shadow mb-2">
                <h4 className="text-lg font-semibold mb-2">Doğru Bilgiler</h4>
                <p className="text-sm text-default-900">
                    - Kitap adı ve Yazar Bilgileri doğru ve eksiksiz girilmelidir.
                    <br />
                    - Yanlış bilgiler kitabın eklenmemesine sebep olabilir.
                </p>
            </div>

            {/* Topluluk Kuralları */}
            <div className="bg-default-100 p-4 rounded-lg shadow mb-2">
                <h4 className="text-lg font-semibold mb-2">Topluluk Kuralları</h4>
                <p className="text-sm text-default-900">
                    - Eklenen kitap, platformun <b>topluluk kuralları</b> ile uyumlu olmalıdır.
                    <br />
                    - Aşırı derecede rahatsız edici veya saldırgan içerik içermemelidir.
                </p>
            </div>
        </div>
    );
};

export default RequestSidebar;
