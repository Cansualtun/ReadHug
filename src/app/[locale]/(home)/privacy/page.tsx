'use client';
import { Card, Spacer } from '@nextui-org/react';

const PrivacyPolicy = () => {
  return (
    <Card style={{ margin: '0 auto', padding: '20px' }}>
      <h2>Gizlilik Politikası</h2>
      <Spacer y={1} />
      <p>
        ReadHug olarak, kullanıcılarımızın gizliliğini önemsiyoruz. Bu Gizlilik
        Politikası, uygulamamızda topladığımız, kullandığımız ve koruduğumuz
        bilgiler hakkında sizi bilgilendirmek için hazırlanmıştır.
      </p>
      <Spacer y={2} />
      <h3>1. Toplanan Bilgiler</h3>
      <div>
        <p> ReadHug, aşağıdaki bilgileri toplayabilir:</p>
        <ul>
          <li>
            <strong>Hesap Bilgileri:</strong> Ad, e-posta adresi, şifre.
          </li>
          <li>
            <strong>Kitap Verileri:</strong> Eklediğiniz kitaplar, okuduğunuz
            sayfa sayısı, kitap notları ve paylaşımlarınız.
          </li>
          <li>
            <strong>Kullanım Verileri:</strong> Uygulamanın kullanımına ilişkin
            veriler (ör. favori kitaplarınız, popüler paylaşımlar).
          </li>
        </ul>
      </div>
      <Spacer y={2} />
      <h3>2. Bilgilerin Kullanımı</h3>
      <div>
        <p>Topladığımız bilgileri şu amaçlarla kullanıyoruz:</p>
        <ul>
          <li>Okuma alışkanlıklarınızı takip etmenizi sağlamak.</li>
          <li>Kitaplar ve paylaşımlar için özelleştirilmiş öneriler sunmak.</li>
          <li>
            Uygulama performansını geliştirmek ve deneyiminizi kişiselleştirmek.
          </li>
        </ul>
      </div>
      <Spacer y={2} />
      <h3>3. Bilgilerin Paylaşımı</h3>
      <div>
        <p>
          ReadHug, bilgilerinizi üçüncü taraflarla yalnızca aşağıdaki durumlarda
          paylaşır:
        </p>
        <ul>
          <li>Yasal yükümlülüklere uymak.</li>
          <li>Uygulamamızın güvenliğini sağlamak.</li>
          <li>Hizmet sağlayıcılarla teknik destek amacıyla.</li>
        </ul>
      </div>
      <Spacer y={2} />
      <h3>4. Veri Güvenliği</h3>
      <p>
        Verileriniz güvenli sunucularda şifrelenmiş olarak saklanır. Hesap
        bilgilerinizin gizliliğini korumak için lütfen güçlü bir şifre oluşturun
        ve şifrenizi kimseyle paylaşmayın.
      </p>
      <Spacer y={2} />
      <h3>5. Kullanıcı Hakları</h3>
      <div>
        <ul>
          <li>
            Kişisel bilgilerinize erişme, düzeltme veya silme talebinde
            bulunabilirsiniz.
          </li>
          <li>Verilerinizin işlenmesine ilişkin itirazda bulunabilirsiniz.</li>
        </ul>
      </div>
      <Spacer y={2} />
      <h3>6. İletişim</h3>
      <div>
        Gizlilik politikamızla ilgili sorularınız için bizimle iletişime
        geçebilirsiniz:
        <ul>
          <li>
            <strong>E-posta:</strong> support@readhug.com
          </li>
        </ul>
      </div>
      <Spacer y={2} />
      <p style={{ textAlign: 'center', color: '$gray600' }}>
        Bu Gizlilik Politikası, 20 Aralık 2024 tarihinde güncellenmiştir.
      </p>
    </Card>
  );
};

export default PrivacyPolicy;
