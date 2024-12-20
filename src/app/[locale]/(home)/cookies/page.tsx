'use client';
import { Card } from '@nextui-org/react';

const CookiesPolicy = () => {
  return (
    <Card style={{ margin: '0 auto', padding: '20px' }}>
      <h2>Çerez Politikası</h2>
      <p>
        ReadHug olarak, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi
        geliştirmek amacıyla çerezler kullanıyoruz. Bu Çerez Politikası, hangi
        çerezleri kullandığımız ve bu çerezlerin nasıl yönetileceği hakkında
        bilgi verir.
      </p>
      <h3>1. Çerez Nedir?</h3>
      <p>
        Çerezler, web siteleri tarafından tarayıcınıza gönderilen ve cihazınızda
        saklanan küçük metin dosyalarıdır. Çerezler, kullanıcı tercihlerini
        hatırlamak ve oturum yönetimi gibi işlevler için kullanılır.
      </p>
      <h3>2. Kullandığımız Çerez Türleri</h3>
      <p>
        - <strong>Gerekli Çerezler:</strong> Web sitemizin düzgün çalışması için
        gereklidir.
      </p>
      <p>
        - <strong>Performans Çerezleri:</strong> Kullanıcıların sitemizi nasıl
        kullandığını anlamamıza yardımcı olur.
      </p>
      <p>
        - <strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini
        hatırlayarak daha kişiselleştirilmiş bir deneyim sunar.
      </p>
      <p>
        - <strong>Hedefleme/İzleme Çerezleri:</strong> İlgi alanlarınıza uygun
        içerik ve reklam sunmamıza olanak tanır.
      </p>
      <h3>3. Çerezlerin Yönetimi</h3>
      <p>
        Tarayıcı ayarlarınızı kullanarak çerezleri yönetebilir veya devre dışı
        bırakabilirsiniz. Çerezleri devre dışı bırakmanız durumunda, web
        sitemizin bazı özellikleri düzgün çalışmayabilir.
      </p>
      <h3>4. İletişim</h3>
      <p>
        Çerez Politikamızla ilgili sorularınız için bizimle iletişime
        geçebilirsiniz:
        <br />
        <strong>E-posta:</strong> support@readhug.com
      </p>
      <p style={{ textAlign: 'center', color: 'gray' }}>
        Bu Çerez Politikası, 20 Aralık 2024 tarihinde güncellenmiştir.
      </p>
    </Card>
  );
};

export default CookiesPolicy;
