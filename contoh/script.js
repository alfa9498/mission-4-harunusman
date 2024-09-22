// Fungsi yang mengubah tombol menjadi input text
function replaceButtonWithInput() {
  const bucketContainer = document.getElementById("bucket-container");

  // Buat elemen input text
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Enter new bucket name";

  // Ganti tombol dengan input text
  const button = document.getElementById("addBucketBtn");
  bucketContainer.replaceChild(inputField, button);

  // Fokus otomatis ke input text
  inputField.focus();

  // Tambahkan event listener pada input untuk mengembalikannya menjadi tombol saat blur
  inputField.addEventListener("blur", function () {
    const bucketName = inputField.value;

    // Buat elemen tombol baru
    const addBucketBtn = document.createElement("button");
    addBucketBtn.className = "add-task";
    addBucketBtn.id = "addBucketBtn";
    addBucketBtn.innerText = "Add Bucket";

    // Ganti input text dengan tombol baru
    bucketContainer.replaceChild(addBucketBtn, inputField);

    // Tambahkan event listener lagi ke tombol baru
    addBucketBtn.addEventListener("click", replaceButtonWithInput);

    // Jika pengguna memasukkan teks, lakukan sesuatu dengan nilai input
    if (bucketName) {
      alert("New bucket name: " + bucketName); // Contoh proses input
    }
  });
}
// Pertama kali, tambahkan event listener ke tombol Add Bucket
document
  .getElementById("addBucketBtn")
  .addEventListener("click", replaceButtonWithInput);

document.addEventListener("DOMContentLoaded", function () {
  const gridIcon = document.getElementById("gridIcon");
  const boardIcon = document.getElementById("boardIcon");
  const container = document.querySelector(".background-container"); // container utama untuk board/grid

  // Set mode grid
  gridIcon.addEventListener("click", function (e) {
    e.preventDefault(); // Mencegah aksi default anchor
    container.classList.add("grid-mode");
    container.classList.remove("board-mode"); // Hapus board mode jika ada
  });

  // Set mode board
  boardIcon.addEventListener("click", function (e) {
    e.preventDefault(); // Mencegah aksi default anchor
    container.classList.add("board-mode");
    container.classList.remove("grid-mode"); // Hapus grid mode jika ada
  });
});
