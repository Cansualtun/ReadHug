'use client';
import { Card } from '@nextui-org/react';

const TermsOfService = () => {
  return (
    <Card style={{ margin: '0 auto', padding: '20px' }}>
      <h2>Hizmet Şartları</h2>
      <p>
        ReadHug hizmetlerini kullanarak, aşağıdaki şartları kabul etmiş
        olursunuz. Bu Hizmet Şartları, uygulamamızda sunduğumuz hizmetlerin
        kullanımına ilişkin kuralları belirler.
      </p>
      <h3>1. Kullanım Koşulları</h3>
      <div>
        <ul>
          <li>
            Uygulama yalnızca kişisel kullanım içindir. Ticari amaçlarla
            kullanılamaz.
          </li>
          <li>
            Hizmetleri yasa dışı veya yetkisiz bir şekilde kullanamazsınız.
          </li>
          <li>
            Hesap bilgilerinizin güvenliğini sağlamak sizin sorumluluğunuzdadır.
          </li>
        </ul>
      </div>
      <h3>2. İçerik Paylaşımı</h3>
      <div>
        <ul>
          <li>
            ReadHug üzerinden paylaştığınız içeriklerden tamamen siz
            sorumlusunuz.
          </li>
          <li>
            Paylaşımlarınızın başkalarının telif haklarını ihlal etmediğinden
            emin olmalısınız.
          </li>
          <li>
            Uygunsuz içerikler paylaşmanız durumunda hesabınız askıya alınabilir
            veya silinebilir.
          </li>
        </ul>
      </div>
      <h3>3. Hizmet Güncellemeleri</h3>
      <p>
        ReadHug, hizmetlerini herhangi bir zamanda bildirimde bulunmaksızın
        değiştirme, askıya alma veya durdurma hakkını saklı tutar.
      </p>
      <h3>4. Sorumluluk Reddi</h3>
      <p>
        ReadHug, kullanıcı içeriklerinden veya hizmetlerin kullanılmasından
        kaynaklanabilecek herhangi bir doğrudan veya dolaylı zarardan sorumlu
        değildir.
      </p>
      <h3>5. İletişim</h3>
      <div>
        <p>
          Hizmet Şartlarımızla ilgili sorularınız için bizimle iletişime
          geçebilirsiniz:
        </p>
        <ul>
          <li>
            <strong>E-posta:</strong> support@readhug.com
          </li>
        </ul>
      </div>
      <p style={{ textAlign: 'center', color: 'gray' }}>
        Bu Hizmet Şartları, 20 Aralık 2024 tarihinde güncellenmiştir.
      </p>
    </Card>
  );
};

export default TermsOfService;
