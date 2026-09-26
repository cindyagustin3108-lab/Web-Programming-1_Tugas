/**
 * ==============================================================================
 * PORTOFOLIO & CURRICULUM VITAE (SPA) - CINDY AULIA AGUSTIN
 * Tugas Mata Kuliah: Pemrograman Web 1 (KULIAH-web1)
 * Jurusan: S1 Teknologi Informasi — Universitas Bina Sarana Informatika
 * ==============================================================================
 * 
 * Daftar Fitur Interaktif:
 * 1. Navigasi SPA Tab via Bottom Navigation Dock
 * 2. Filter Kategori Riwayat Pengalaman
 * 3. Salin Kontak ke Clipboard (WhatsApp & Email)
 * 4. Formulir Pengiriman Pesan Cepat (WhatsApp & Email Client)
 * ==============================================================================
 */

// Menjalankan fungsi setelah seluruh dokumen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  inisialisasiNavigasiSPA();
  inisialisasiFilterPengalaman();
  inisialisasiFormPesan();
});

/* ==============================================================================
   1. Navigasi SPA (Single Page Application)
   Mengatur perpindahan halaman/bagian tanpa melakukan reload halaman
   ============================================================================== */
function inisialisasiNavigasiSPA() {
  const semuaTombolNav = document.querySelectorAll('.dock-link');
  const btnScrollTop = document.getElementById('btnDockScrollTop');

  // Menambahkan event listener klik pada setiap tombol di navigasi bawah
  semuaTombolNav.forEach(tombol => {
    tombol.addEventListener('click', (e) => {
      e.preventDefault();
      const namaTab = tombol.getAttribute('data-tab');
      pindahHalaman(namaTab);
    });
  });

  // Tombol untuk kembali ke bagian paling atas
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Memeriksa apakah ada hash di URL saat pertama kali halaman dibuka (misal: #pengalaman)
  const hashAwal = window.location.hash.replace('#', '');
  if (hashAwal && document.getElementById(hashAwal)) {
    pindahHalaman(hashAwal, false);
  }
}

/**
 * Fungsi global untuk berpindah tab (dapat dipanggil juga dari tombol di dalam konten)
 * @param {string} tabId - ID section yang ingin ditampilkan (profil, pendidikan, dll)
 * @param {boolean} updateHash - Menentukan apakah URL hash ikut diperbarui
 */
window.switchSPATab = function(tabId, updateHash = true) {
  pindahHalaman(tabId, updateHash);
};

function pindahHalaman(tabId, updateHash = true) {
  const targetSection = document.getElementById(tabId);
  const targetTombol = document.querySelector(`.dock-link[data-tab="${tabId}"]`);

  // Jika section tidak ditemukan, hentikan fungsi
  if (!targetSection) return;

  // 1. Sembunyikan semua section dengan menghapus class 'active'
  const semuaSection = document.querySelectorAll('.spa-view');
  semuaSection.forEach(sec => {
    sec.classList.remove('active');
  });

  // 2. Tampilkan section yang dipilih dengan menambahkan class 'active'
  targetSection.classList.add('active');

  // 3. Perbarui status tombol aktif pada bottom navigation dock
  const semuaTombol = document.querySelectorAll('.dock-link');
  semuaTombol.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  if (targetTombol) {
    targetTombol.classList.add('active');
    targetTombol.setAttribute('aria-selected', 'true');
  }

  // 4. Geser tampilan layar ke paling atas secara halus (smooth scroll)
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // 5. Perbarui judul tab di browser sesuai halaman yang aktif
  const judulBaru = targetSection.getAttribute('data-title');
  if (judulBaru) {
    document.title = judulBaru;
  }

  // 6. Perbarui hash pada URL tanpa me-reload halaman
  if (updateHash) {
    window.location.hash = tabId;
  }
}

/* ==============================================================================
   2. Filter Kategori Pengalaman
   Menyaring kartu pengalaman berdasarkan tombol kategori yang dipilih
   ============================================================================== */
function inisialisasiFilterPengalaman() {
  const tombolFilter = document.querySelectorAll('.filter-tab');
  const daftarKartu = document.querySelectorAll('.timeline-editorial-item');

  tombolFilter.forEach(tombol => {
    tombol.addEventListener('click', () => {
      // Hilangkan class 'active' dari semua tombol filter
      tombolFilter.forEach(btn => btn.classList.remove('active'));
      // Tambahkan class 'active' pada tombol yang baru saja diklik
      tombol.classList.add('active');

      const kategoriDipilih = tombol.getAttribute('data-filter');

      // Tampilkan atau sembunyikan kartu pengalaman sesuai kategori
      daftarKartu.forEach(kartu => {
        const kategoriKartu = kartu.getAttribute('data-category');

        if (kategoriDipilih === 'all' || kategoriKartu === kategoriDipilih) {
          kartu.style.display = 'grid';
          kartu.style.opacity = '0';
          setTimeout(() => {
            kartu.style.transition = 'opacity 0.3s ease';
            kartu.style.opacity = '1';
          }, 30);
        } else {
          kartu.style.display = 'none';
        }
      });
    });
  });
}

/* ==============================================================================
   3. Fitur Salin Kontak (Copy to Clipboard)
   Memudahkan pengunjung menyalin email atau nomor WhatsApp ke clipboard
   ============================================================================== */
window.copyToClipboard = function(teks, label = 'Teks') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(teks).then(() => {
      tampilkanToast(`${label} berhasil disalin ke clipboard!`);
    }).catch(() => {
      salinAlternatif(teks, label);
    });
  } else {
    salinAlternatif(teks, label);
  }
};

// Metode cadangan jika Clipboard API tidak didukung peramban lama
function salinAlternatif(teks, label) {
  const elemenInput = document.createElement('textarea');
  elemenInput.value = teks;
  elemenInput.style.position = 'fixed';
  elemenInput.style.left = '-9999px';
  document.body.appendChild(elemenInput);
  elemenInput.select();

  try {
    document.execCommand('copy');
    tampilkanToast(`${label} berhasil disalin!`);
  } catch (err) {
    tampilkanToast(`Gagal menyalin ${label}`);
  }

  document.body.removeChild(elemenInput);
}

// Menampilkan kotak notifikasi (toast) selama 3 detik
let timerToast = null;
function tampilkanToast(pesan) {
  const elemenToast = document.getElementById('editorialToast');
  const elemenTeks = document.getElementById('toastMessage');

  if (elemenToast && elemenTeks) {
    elemenTeks.textContent = pesan;
    elemenToast.classList.add('show');

    clearTimeout(timerToast);
    timerToast = setTimeout(() => {
      elemenToast.classList.remove('show');
    }, 3000);
  }
}

/* ==============================================================================
   4. Formulir Pesan Cepat (Integrasi WhatsApp & Email)
   Mengambil data input dan membuka aplikasi WhatsApp / Email secara langsung
   ============================================================================== */
function inisialisasiFormPesan() {
  const btnKirimWA = document.getElementById('btnSendWA');
  const btnKirimEmail = document.getElementById('btnSendEmail');
  const inputNama = document.getElementById('senderName');
  const inputSubjek = document.getElementById('msgSubject');
  const inputPesan = document.getElementById('msgContent');

  // Tombol Kirim ke WhatsApp
  if (btnKirimWA) {
    btnKirimWA.addEventListener('click', () => {
      const nama = inputNama.value.trim() || 'Rekan/HRD';
      const subjek = inputSubjek.value.trim() || 'Peluang Kolaborasi';
      const pesan = inputPesan.value.trim() || 'Halo Cindy, saya tertarik dengan profil dan portofolio Anda.';

      const pesanFormat = `Halo Cindy Aulia Agustin,\n\nNama: ${nama}\nPerihal: ${subjek}\n\nPesan:\n${pesan}`;
      const urlWhatsApp = `https://wa.me/628979953195?text=${encodeURIComponent(pesanFormat)}`;

      window.open(urlWhatsApp, '_blank');
    });
  }

  // Tombol Kirim ke Email
  if (btnKirimEmail) {
    btnKirimEmail.addEventListener('click', () => {
      const nama = inputNama.value.trim() || 'Rekan/HRD';
      const subjek = inputSubjek.value.trim() || 'Peluang Kolaborasi - Cindy Aulia Agustin';
      const pesan = inputPesan.value.trim() || 'Halo Cindy, kami tertarik untuk mendiskusikan peluang kerja sama atau magang.';

      const isiEmail = `Halo Cindy,\n\n${pesan}\n\nSalam hormat,\n${nama}`;
      const urlEmail = `mailto:cindyagustin3108@gmail.com?subject=${encodeURIComponent(subjek)}&body=${encodeURIComponent(isiEmail)}`;

      window.location.href = urlEmail;
    });
  }
}
