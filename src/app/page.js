'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// --- CONFIGURATION & DATA ---
const BOARD_SIZE = 10
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE

const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 }
const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 }
const actionTiles = [2, 3, 5, 7, 8, 10, 12, 13, 15, 17, 20, 22, 23, 25, 27, 30, 32, 34, 35, 37, 39, 40, 43, 45, 48, 50, 52, 54, 55, 58, 61, 63, 65, 68, 70, 74, 76, 79, 82, 85, 88, 89, 92, 94, 96]

const intimateQuestions = [
  // --- VISI MASA DEPAN & TUJUAN HIDUP ---
  "Apa definisi 'sukses' menurut versi kamu sendiri, bukan menurut standar orang lain?",
  'Jika uang bukan lagi masalah, kegiatan atau pekerjaan apa yang bakal kamu lakuin setiap hari?',
  'Menurutmu, rumah impian kita nanti nuansanya seperti apa? (Minimalis, alam, dsb)',
  'Apa cita-cita terbesarmu yang belum pernah kamu ceritain ke banyak orang?',
  'Dimana kamu melihat dirimu dan hubungan kita berada 5 tahun dari sekarang?',
  'Hal apa yang paling ingin kamu wujudkan bersamaku sebelum kita menginjak usia 40 tahun?',
  'Menurutmu, apa satu pencapaian yang wajib kita raih bersama sebagai pasangan?',
  'Kalau kita punya kesempatan untuk menetap di negara atau kota lain, kamu mau tinggal di mana dan kenapa?',
  'Apa mimpimu saat kecil yang sampai sekarang masih sering terbayang untuk diwujudkan?',
  'Bagaimana caramu membayangkan rutinitas pagi kita kelak saat sudah tinggal satu atap?',
  'Apa tujuan hidupmu saat ini yang sedang benar-benar kamu perjuangkan?',
  'Jika kamu hanya punya waktu 1 tahun untuk hidup bebas, apa yang akan kamu lakukan bersamaku?',
  'Menurutmu, apa hal paling penting yang harus kita persiapkan sebelum memutuskan menikah?',
  'Bagaimana kamu ingin dikenal atau diingat oleh orang-orang di sekitarmu saat kamu sudah tua nanti?',
  'Adakah tempat spesifik di dunia ini yang sangat ingin kamu kunjungi bersamaku? Kenapa tempat itu?',
  // --- PENGEMBANGAN DIRI & MINDSET ---
  'Apa satu kebiasaan buruk yang sedang berusaha keras kamu ubah tahun ini?',
  'Apa pelajaran hidup terbesar yang kamu dapatkan dari kegagalanmu di masa lalu?',
  'Siapa tokoh atau sosok (bisa tokoh terkenal atau orang terdekat) yang paling memengaruhi cara berpikirmu?',
  'Menurutmu, sifat apa dari dirimu yang paling butuh diperbaiki agar kamu jadi versi dirimu yang lebih baik?',
  'Buku, film, atau podcast apa yang paling banyak mengubah sudut pandangmu terhadap dunia?',
  'Bagaimana caramu mengelola stres atau rasa cemas saat semuanya terasa terlalu berat?',
  'Apa hal yang dulunya sering bikin kamu insecure, tapi sekarang sudah bisa kamu terima dengan ikhlas?',
  'Menurutmu, apakah manusia bisa benar-benar berubah? Kenapa?',
  'Skill atau keterampilan baru apa yang sangat ingin kamu pelajari dalam 2 tahun ke depan?',
  'Apa satu keputusan di masa lalu yang paling kamu syukuri karena telah membentuk dirimu yang sekarang?',
  'Kapan kamu merasa paling bangga dengan dirimu sendiri sejauh hidupmu ini?',
  'Bagaimana caramu merayakan pencapaian-pencapaian kecil dalam hidupmu?',
  'Apa satu ketakutan irasionalmu yang ingin banget kamu taklukkan?',
  'Menurutmu, seberapa penting sebuah rutinitas harian dalam membentuk kesuksesan seseorang?',
  'Sebutkan tiga kata yang paling menggambarkan prinsip hidupmu saat ini!',
  'Apa kritik membangun yang paling berkesan yang pernah kamu terima dari seseorang?',
  'Saat sedang down, kalimat afirmasi seperti apa yang biasanya paling kamu butuhkan?',
  "Bagaimana kamu memandang sebuah 'penolakan' (dalam karir maupun sosial)?",
  'Sifat apa dari diriku yang secara diam-diam sering kamu jadikan contoh untuk pengembangan dirimu sendiri?',
  'Pernahkah kamu memaafkan seseorang yang tidak pernah meminta maaf? Bagaimana rasanya?',
  // --- HUBUNGAN, LDR, & KOMUNIKASI ---
  'Apa momen tersulit dalam LDR kita yang menurutmu justru bikin mental hubungan kita makin kuat?',
  'Menurutmu, pondasi paling penting untuk membangun rumah tangga yang bahagia itu apa?',
  'Kapan momen di mana kamu merasa paling didukung olehku secara emosional walau kita terhalang jarak?',
  'Pas kita lagi ada masalah atau salah paham, pendekatan penyelesaian seperti apa yang paling efektif buatmu?',
  'Apa kebiasaan kecil dari aku yang selalu berhasil mengembalikan mood-mu jadi positif?',
  'Sifat apa dari aku yang awalnya kamu kira biasa aja, tapi lama-lama jadi hal yang sangat kamu syukuri?',
  'Pernah nggak kamu merasa cemburu, tapi memilih untuk introspeksi diri dulu sebelum marah? Ceritakan!',
  "Menurutmu, apa perbedaan antara 'cinta' di tahun pertama kita dan 'cinta' yang kita rasakan saat ini?",
  'Bagaimana caramu meyakinkan diri sendiri saat sedang merasa sepi dan lelah dengan situasi LDR ini?',
  "Bentuk dukungan (bahasa cinta) seperti apa yang paling membuatmu merasa 'penuh' dan dihargai?",
  'Menurutmu, batas toleransi apa yang tidak boleh dilanggar sama sekali dalam hubungan kita?',
  'Apa hal spesifik yang aku lakukan, yang membuatmu yakin bahwa aku adalah pasangan hidup yang tepat?',
  'Menurutmu, seberapa penting meminta maaf dan memaafkan sebelum kita tidur jika sedang bertengkar?',
  'Adakah kata-kataku di masa lalu yang sangat memotivasimu untuk bangkit dari keterpurukan?',
  'Sebutkan satu hal tentang caraku berpikir yang paling kamu sukai!',
  'Bagaimana caramu menjaga kepercayaanmu padaku 100% meski kita jarang bertemu?',
  'Menurutmu, apa tantangan paling berat pas nanti kita hidup bersama, dan gimana cara kita mencegahnya sejak sekarang?',
  'Hal apa yang paling sering bikin kamu overthinking tentang kita, dan bagaimana aku bisa bantu menenangkanmu?',
  'Sebutkan satu aturan tidak tertulis dalam hubungan kita yang menurutmu sangat sehat dan harus terus dipertahankan!',
  'Apa momen paling sederhana bersamaku lewat video call yang bisa membuatmu tersenyum seharian?',
  "Menurutmu, bagaimana cara terbaik untuk tetap merasa 'tumbuh bersama' meskipun kita sedang di kota yang berbeda?",
  'Jika aku sedang mengalami hari yang sangat buruk, apa hal pertama yang akan kamu lakukan untukku?',
  'Menurutmu, apa kekuatan terbesar dari hubungan kita yang mungkin jarang dimiliki oleh pasangan lain?',
  'Pelajaran tentang ego dan kedewasaan apa yang paling banyak kamu pelajari semenjak bersamaku?',
  'Sebutkan 3 hal yang paling ingin kita pelajari atau eksplorasi bersama saat kita sudah satu kota nanti!',
  // --- KARIR, FINANSIAL, & KERJA KERAS ---
  'Bagaimana pandanganmu tentang manajemen keuangan setelah kita menikah nanti? Digabung atau dipisah?',
  'Menurutmu, apa hal paling penting dalam memilih pekerjaan: Gaji, lingkungan kerja, atau passion?',
  'Bagaimana caramu menyeimbangkan ambisi karir dengan waktu untuk keluarga atau hubungan kita?',
  'Jika suatu saat aku kehilangan pekerjaan, dukungan seperti apa yang paling kamu harapkan dari kita berdua?',
  'Apa tujuan finansial terbesarmu dalam 3 tahun ke depan?',
  'Menurutmu, seberapa penting dana darurat, dan bagaimana cara kita mengumpulkannya bersama?',
  'Bagaimana pendapatmu tentang memiliki utang produktif (seperti KPR) vs menabung dulu sampai cukup?',
  'Pernahkah kamu merasa sangat gagal di pekerjaan/kuliah? Bagaimana kamu bangkit dari situ?',
  'Apa investasi terbaik (selain uang) yang pernah kamu lakukan untuk masa depanmu?',
  'Menurutmu, lebih baik fokus membangun satu sumber penghasilan utama yang besar atau punya banyak sumber penghasilan kecil?',
  'Bagaimana caramu menyikapi perbedaan penghasilan jika suatu saat salah satu dari kita berpenghasilan jauh lebih besar?',
  'Apa pembelian barang/pengalaman yang paling kamu syukuri karena sangat bermanfaat buat produktivitasmu?',
  'Apakah kamu tipe yang merencanakan keuangan secara mendetail atau santai? Mengapa?',
  'Jika kita ingin memulai bisnis berdua suatu saat nanti, bisnis apa yang menurutmu paling cocok dengan karakter kita?',
  'Menurutmu, apa bentuk pemborosan finansial yang paling ingin kamu hindari saat kita membangun keluarga nanti?',
  "Apa pendapatmu tentang 'hustle culture' (kerja terus-menerus tanpa henti)?",
  "Saat sedang burnout karena pekerjaan, rutinitas apa yang wajib kamu lakukan untuk 'reset' energi?",
  'Hal apa dari etos kerjaku yang menurutmu paling menginspirasimu?',
  'Apakah menurutmu pendidikan formal masih menjadi kunci utama kesuksesan saat ini? Kenapa?',
  'Jika kamu bisa memberi saran karir pada dirimu di usia 18 tahun, apa yang akan kamu katakan?',
  // --- KELUARGA & PARENTING ---
  'Kalau kita punya anak nanti, apa satu nilai moral atau prinsip hidup yang paling wajib ditanamkan sejak dini?',
  'Nilai kehidupan apa dari orang tuamu yang pengen banget kamu teruskan ke anak kita kelak?',
  'Dan sebaliknya, kebiasaan apa dari pola asuh keluargamu yang TIDAK ingin kamu ulangi pada anak kita?',
  'Menurutmu, bagaimana cara mendidik anak agar memiliki mental yang tangguh namun tetap berempati?',
  'Bagaimana pandanganmu tentang pembagian tugas rumah tangga saat kita sudah menikah nanti?',
  'Bagaimana caramu bersikap jika suatu saat ada perbedaan pendapat yang tajam antara kita dengan orang tua/mertua?',
  'Menurutmu, seberapa penting peran seorang ayah dalam pengasuhan anak sehari-hari secara langsung?',
  'Apa pendapatmu tentang anak yang memilih jalan karir atau hidup yang jauh berbeda dengan ekspektasi kita?',
  'Tradisi keluarga seperti apa yang ingin kamu ciptakan bersama? (Misal: makan malam tanpa HP, liburan tahunan)',
  'Bagaimana cara kita menjaga hubungan pernikahan agar tetap romantis ketika fokus kita mulai terbagi ke anak-anak kelak?',
  'Menurutmu, apa tantangan terbesar membesarkan anak di era digital seperti sekarang ini?',
  'Bagaimana pandanganmu tentang pendidikan anak: lebih baik mengutamakan kebebasan berekspresi atau kedisiplinan yang ketat?',
  'Apa kenangan masa kecilmu bersama orang tua yang paling membekas dan ingin kamu ciptakan ulang untuk anak kita?',
  'Bagaimana caramu mengelola privasi anak dan batasan penggunaan sosial media mereka nantinya?',
  'Menurutmu, seberapa penting melibatkan pasangan dalam setiap keputusan sekecil apapun yang menyangkut keluarga?',
  'Jika suatu saat anak kita mengalami kegagalan besar, kalimat pertama apa yang akan kamu ucapkan padanya?',
  'Apa pandanganmu tentang merawat orang tua ketika mereka sudah di usia senja nanti?',
  'Bagaimana cara menumbuhkan sifat gemar membaca atau rasa ingin tahu yang tinggi pada anak kita kelak?',
  "Menurutmu, apa 'bahasa cinta' yang paling penting diajarkan agar anak merasa aman dan disayangi?",
  'Sifat positif apa dariku yang sangat kamu harapkan menurun secara genetik atau perilaku ke anak kita?',
  // --- KESEHATAN MENTAL, SPIRITUAL & LINGKUNGAN ---
  'Seberapa penting menjaga kesehatan fisik (olahraga/diet) menurutmu untuk masa depan hubungan kita?',
  'Bagaimana caramu merawat kesehatan mentalmu di saat dunia sedang terasa bergerak terlalu cepat?',
  'Menurutmu, seberapa besar peran lingkungan pertemanan dalam membentuk karakter seseorang?',
  "Apa momen dalam hidupmu di mana kamu merasa 'keajaiban' itu nyata atau merasa sangat diberkati?",
  "Bagaimana kamu menyikapi teman atau lingkungan yang ternyata membawa energi negatif atau 'toxic'?",
  'Apakah kamu merasa spiritualitas/agama memegang peran penting dalam memandu keputusan-keputusan hidupmu?',
  'Menurutmu, lebih baik punya sedikit teman tapi sangat dekat, atau punya banyak jaringan pertemanan tapi tidak terlalu dalam?',
  'Apa kegiatan sederhana yang tidak membutuhkan uang, yang bisa langsung membuat perasaanmu damai?',
  'Seberapa peduli kamu terhadap isu sosial atau lingkungan di sekitarmu? Isu apa yang paling menarik perhatianmu?',
  "Bagaimana caramu menolak atau berkata 'tidak' pada hal-hal yang tidak sejalan dengan prinsipmu tanpa menyakiti orang lain?",
  'Apa hal yang paling kamu syukuri dari keadaan kesehatan fisik dan mental kita saat ini?',
  'Menurutmu, batasan seperti apa yang harus kita buat agar kehidupan profesional tidak merusak ketenangan di rumah?',
  'Pernahkah kamu merasa harus berpura-pura menjadi orang lain demi diterima lingkungan? Bagaimana akhirnya kamu melewatinya?',
  "Bagaimana pendapatmu tentang 'istirahat'—apakah itu kemalasan atau kebutuhan krusial?",
  'Jika energi positif bisa diukur, aktivitas harian apa yang memberikan tambahan energi paling besar buatmu?',
  // --- REFLEKSI & APRESIASI ---
  'Sebutkan 3 hal kecil yang terjadi hari ini (atau minggu ini) yang membuatmu bersyukur!',
  'Kapan terakhir kali kamu tersenyum tulus karena mengingat percakapan kita?',
  'Apa hal paling berani yang pernah aku lakukan, yang membuatmu sangat terkesan?',
  'Jika kita bisa menulis buku tentang perjalanan LDR kita, apa judul yang cocok menurutmu?',
  'Sebutkan satu bakat terpendamku yang menurutmu harus lebih banyak aku kembangkan!',
  'Apa pujian atau apresiasi dari aku yang paling membuatmu merasa percaya diri berkali-kali lipat?',
  'Menurutmu, fase hidup seperti apa yang sedang kita jalani saat ini, dan apa fokus utamanya?',
  'Kalau hari ini adalah hari jadi pernikahan kita yang ke-20, cerita perjuangan apa yang bakal paling sering kita ceritakan ulang?',
  'Apa satu pertanyaan yang selalu ingin kamu tanyakan kepadaku tapi belum sempat kamu utarakan?',
  'Sebutkan satu momen kegagalan kita sebagai pasangan yang pada akhirnya menjadi titik balik pendewasaan hubungan kita!',
  'Coba jujur, seberapa sering kamu berdoa secara spesifik tentang kesuksesanku dan hubungan kita?',
  "Menurutmu, apa definisi 'pulang' saat kamu merasa sangat kelelahan dengan dunia luar?",
  'Apa pelajaran tentang cinta tanpa syarat yang kamu temukan setelah kita menjalani hubungan jarak jauh ini?',
  'Jika aku tiba-tiba ragu dengan kemampuanku meraih mimpiku, argumen apa yang akan kamu gunakan untuk meyakinkanku lagi?',
  'Hal apa yang pada dirimu yang dulunya sangat kamu benci, namun sekarang kamu cintai sebagai bagian dari keunikanmu?',
  'Kapan terakhir kali kamu merasa kedamaian yang luar biasa hanya dengan berdiam diri bersama pikiranku?',
  'Sebutkan satu janji kecil pada diri sendiri yang ingin kamu pegang kuat-kuat demi masa depan kita!',
  'Menurutmu, memori apa di tahun pertama kita pacaran yang masih menjadi fondasi kekuatan kita saat ini?',
  'Apa hal yang dulunya membuat kita sering berdebat, tapi sekarang sudah menjadi hal yang kita sepakati dengan damai?',
  "Jika kamu harus mendeskripsikan 'warna' dan 'suasana' dari hubungan kita saat ini ke orang lain, apa jawabanmu?",
  // --- EXTRA MINDSET BUIDLING ---
  "Apa pemikiran 'kolot' atau tradisional yang menurutmu sudah tidak relevan lagi untuk diterapkan di hidup kita?",
  'Menurutmu, apa kunci utama untuk bangkit setelah dikhianati atau dikecewakan ekspektasi sendiri?',
  'Seberapa penting memvalidasi perasaan sedih sebelum akhirnya mencari solusi logika?',
  'Bagaimana caramu menjaga integritas dirimu ketika tidak ada satu orang pun yang melihatmu?',
  'Apa satu kutipan (quotes) favoritmu yang selalu kamu ingat saat sedang merasa ragu?',
]

// --- MAIN COMPONENT ---
export default function UlarTanggaLDR() {
  // States
  const [players, setPlayers] = useState({
    1: { position: 1, color: '#3b82f6', name: 'Player 1', icon: 'fa-mars' },
    2: { position: 1, color: '#ec4899', name: 'Player 2', icon: 'fa-venus' },
  })
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [isMoving, setIsMoving] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [diceNum, setDiceNum] = useState(1)
  const [rollText, setRollText] = useState('')

  // Perbaikan Hydration: Gunakan ID statis saat inisialisasi state pertama kali
  const [logs, setLogs] = useState([{ id: 'log-init', msg: '<div class="italic text-gray-400">Game dimulai. Semoga beruntung!</div>' }])

  // Board Coordinates State for SVG & Tokens
  const [cellsPos, setCellsPos] = useState({})

  // Modals State
  const [showRules, setShowRules] = useState(false)
  const [showWin, setShowWin] = useState(false)
  const [actionModal, setActionModal] = useState({ show: false, type: '', text: '' })

  // Refs
  const boardRef = useRef(null)
  const cellRefs = useRef({})
  const logEndRef = useRef(null)

  // Auto scroll logs
  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Generate Board Layout (ZigZag)
  const boardCells = useMemo(() => {
    let cells = []
    let cellNum = TOTAL_CELLS
    let rowDir = -1
    for (let row = 0; row < BOARD_SIZE; row++) {
      let rowNumbers = []
      for (let col = 0; col < BOARD_SIZE; col++) {
        rowNumbers.push(cellNum--)
      }
      if (rowDir === 1) rowNumbers.reverse()
      cells.push(...rowNumbers)
      rowDir *= -1
    }
    return cells
  }, [])

  // Calculate Cell Positions for SVG Lines & Tokens
  const calculatePositions = useCallback(() => {
    if (!boardRef.current) return
    const boardRect = boardRef.current.getBoundingClientRect()
    const newPos = {}

    for (let i = 1; i <= 100; i++) {
      const cell = cellRefs.current[i]
      if (cell) {
        const rect = cell.getBoundingClientRect()
        newPos[i] = {
          x: rect.left - boardRect.left + rect.width / 2,
          y: rect.top - boardRect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        }
      }
    }
    setCellsPos(newPos)
  }, [])

  // Initialize positions and resize listener
  useEffect(() => {
    // slight delay to ensure DOM is fully painted
    setTimeout(calculatePositions, 100)
    window.addEventListener('resize', calculatePositions)
    return () => window.removeEventListener('resize', calculatePositions)
  }, [calculatePositions])

  // Add Log Helper
  const addLog = (msg) => {
    setLogs((prev) => [...prev, { id: Date.now() + Math.random(), msg }])
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // Handle Dice Roll
  const rollDice = async () => {
    if (isMoving) return

    // --- Tambahan: Otomatis scroll ke papan (khususnya untuk layar HP) ---
    if (boardRef.current && window.innerWidth < 1024) {
      boardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    setIsMoving(true)
    setIsRolling(true)
    setRollText('')

    let finalNum = 1
    // Animation fake rolls
    for (let i = 0; i < 10; i++) {
      setDiceNum(Math.floor(Math.random() * 6) + 1)
      await sleep(50)
    }

    finalNum = Math.floor(Math.random() * 6) + 1
    setDiceNum(finalNum)
    setIsRolling(false)

    const pName = players[currentPlayer].name
    setRollText(`${pName} dapat angka ${finalNum}!`)
    addLog(`<span style="color:${players[currentPlayer].color}">■</span> ${pName} jalan ${finalNum} langkah.`)

    await handleMovement(finalNum)
  }

  // Handle Player Movement Step-by-Step
  const handleMovement = async (steps) => {
    let currentPos = players[currentPlayer].position
    let targetPos = currentPos + steps

    if (targetPos > 100) {
      targetPos = 100 - (targetPos - 100)
      addLog(`Terlalu besar! Mundur ke ${targetPos}.`)
    }

    const stepDir = currentPos < targetPos ? 1 : -1

    while (currentPos !== targetPos) {
      currentPos += stepDir
      setPlayers((prev) => ({
        ...prev,
        [currentPlayer]: { ...prev[currentPlayer], position: currentPos },
      }))
      await sleep(300)
    }

    await handleSpecialTiles(targetPos)
  }

  // Handle Snakes, Ladders, and Actions
  const handleSpecialTiles = async (pos) => {
    let finalPos = pos
    let hasMoved = false

    if (ladders[pos]) {
      finalPos = ladders[pos]
      addLog(`<span class="font-bold text-pink-600">Naik Tangga! ${pos} ➔ ${finalPos}</span>`)
      hasMoved = true
    } else if (snakes[pos]) {
      finalPos = snakes[pos]
      addLog(`<span class="font-bold text-pink-600">Yahh digigit Ular! ${pos} ➔ ${finalPos}</span>`)
      hasMoved = true
    }

    if (hasMoved) {
      await sleep(600)
      setPlayers((prev) => ({
        ...prev,
        [currentPlayer]: { ...prev[currentPlayer], position: finalPos },
      }))
      await sleep(500) // wait for jump animation
    }

    if (finalPos === 100) {
      addLog(`<span class="font-bold text-pink-600">🎉 ${players[currentPlayer].name} MENANG! 🎉</span>`)
      setShowWin(true)
      return
    }

    if (actionTiles.includes(finalPos)) {
      const randomQ = intimateQuestions[Math.floor(Math.random() * intimateQuestions.length)]
      setActionModal({ show: true, type: 'question', text: randomQ })
    } else {
      endTurn()
    }
  }

  const endTurn = () => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1))
    setRollText('')
    setIsMoving(false)
  }

  // Modal Actions
  const handleAnswered = () => {
    setActionModal({ ...actionModal, show: false })
    addLog(`${players[currentPlayer].name} menjawab pertanyaan dengan jujur. 💖`)
    setTimeout(endTurn, 300)
  }

  const handleSkip = async () => {
    setActionModal({ ...actionModal, show: false })
    addLog(`<span class="font-bold text-pink-600">❌ ${players[currentPlayer].name} tidak menjawab. Mundur 3 langkah!</span>`)

    let newPos = players[currentPlayer].position - 3
    if (newPos < 1) newPos = 1

    await sleep(300)
    setPlayers((prev) => ({
      ...prev,
      [currentPlayer]: { ...prev[currentPlayer], position: newPos },
    }))

    await sleep(600)
    endTurn()
  }

  const resetGame = () => {
    setPlayers((prev) => ({
      1: { ...prev[1], position: 1 },
      2: { ...prev[2], position: 1 },
    }))
    setCurrentPlayer(1)
    setIsMoving(false)
    setRollText('')
    setLogs([{ id: Date.now(), msg: '<div class="italic text-gray-400">Game direset. Selamat bermain!</div>' }])
    setShowWin(false)
  }

  // SVG Line Generator Helper
  const getCurvePath = (startPos, endPos, isSnake, seed) => {
    if (!startPos || !endPos) return ''
    if (isSnake) {
      const midX = (startPos.x + endPos.x) / 2 + ((seed % 40) - 20)
      const midY = (startPos.y + endPos.y) / 2 + (((seed * 2) % 40) - 20)
      return `M ${startPos.x} ${startPos.y} Q ${midX} ${midY} ${endPos.x} ${endPos.y}`
    }
    return `M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`
  }

  const getDiceIcon = (num) => {
    const icons = ['fa-dice-one', 'fa-dice-two', 'fa-dice-three', 'fa-dice-four', 'fa-dice-five', 'fa-dice-six']
    return icons[num - 1] || 'fa-dice-one'
  }

  // Current Modals Props Helper
  const asker = currentPlayer === 1 ? players[2].name : players[1].name
  const answerer = players[currentPlayer].name

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 font-['Fredoka',sans-serif]"
      style={{ backgroundColor: '#fff0f6', backgroundImage: 'radial-gradient(#fbcfe8 2px, transparent 2px)', backgroundSize: '24px 24px' }}
    >
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>

      <div className="w-full max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-white">
        {/* Header */}
        <div className="bg-[#ff6b9e] p-6 pb-8 text-white text-center rounded-t-[1.5rem]">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3 drop-shadow-sm">🤍 Ular Tangga LDR 🤍</h1>
          <p className="mt-2 text-pink-50 font-medium text-lg">Biar Jauh di Mata, Tetap Dekat di Hati ✨</p>
        </div>

        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 bg-white rounded-t-3xl -mt-4 relative z-10">
          {/* Left Side: Board */}
          <div className="flex-1 w-full flex flex-col items-center">
            <div className="w-full relative" ref={boardRef}>
              {/* CSS Grid Board */}
              <div className="grid grid-cols-10 grid-rows-10 gap-[2px] w-full max-w-[600px] aspect-square mx-auto bg-white border-4 border-pink-400 rounded-xl p-1 shadow-[0_8px_20px_-5px_rgba(244,114,182,0.4)] relative">
                {boardCells.map((num) => {
                  const isSnakeHead = !!snakes[num]
                  const isSnakeTail = Object.values(snakes).includes(num)
                  const isLadderBot = !!ladders[num]
                  const isLadderTop = Object.values(ladders).includes(num)

                  let cellClasses = 'rounded-md flex justify-center items-center font-bold text-pink-700 relative text-[clamp(0.9rem,2.5vw,1.4rem)] transition-all duration-200 '
                  if (isSnakeHead) cellClasses += 'bg-yellow-300 text-yellow-800 '
                  else if (isSnakeTail) cellClasses += 'bg-yellow-200 '
                  else if (isLadderBot) cellClasses += 'bg-green-300 text-green-900 '
                  else if (isLadderTop) cellClasses += 'bg-green-200 '
                  else cellClasses += num % 2 === 0 ? 'bg-pink-100 ' : 'bg-pink-50 border border-pink-100 '

                  return (
                    <div key={num} id={`cell-${num}`} ref={(el) => (cellRefs.current[num] = el)} className={cellClasses}>
                      {num}
                      {actionTiles.includes(num) && <i className="fa-solid fa-heart absolute bottom-1 right-1 text-[10px] sm:text-xs opacity-50 text-pink-400"></i>}
                    </div>
                  )
                })}
              </div>

              {/* SVG Snakes & Ladders */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                {Object.entries(snakes).map(([head, tail], i) => (
                  <path key={`snake-${head}`} d={getCurvePath(cellsPos[head], cellsPos[tail], true, i * 17)} stroke="#f43f5e" strokeWidth="5" strokeDasharray="8,6" fill="none" opacity="0.85" />
                ))}
                {Object.entries(ladders).map(([bottom, top]) => (
                  <path key={`ladder-${bottom}`} d={getCurvePath(cellsPos[bottom], cellsPos[top], false, 0)} stroke="#4ade80" strokeWidth="8" fill="none" opacity="0.85" />
                ))}
              </svg>

              {/* Player Tokens */}
              {[1, 2].map((pId) => {
                const pos = players[pId].position
                if (!cellsPos[pos]) return null

                const cellData = cellsPos[pos]
                const tokenSize = Math.min(cellData.width, cellData.height) * 0.6

                let offsetX = 0,
                  offsetY = 0
                if (players[1].position === players[2].position) {
                  offsetX = pId === 1 ? -tokenSize / 4 : tokenSize / 4
                  offsetY = pId === 1 ? -tokenSize / 4 : tokenSize / 4
                }

                return (
                  <div
                    key={`player-${pId}`}
                    className="absolute rounded-full flex justify-center items-center text-white text-[clamp(0.6rem,1.5vw,1rem)] shadow-[0_2px_5px_rgba(0,0,0,0.3)] z-10 transition-all duration-400 ease-out"
                    style={{
                      backgroundColor: players[pId].color,
                      width: tokenSize,
                      height: tokenSize,
                      left: cellData.x - tokenSize / 2 + offsetX,
                      top: cellData.y - tokenSize / 2 + offsetY,
                      transition: isMoving && pId === currentPlayer ? 'all 0.3s linear' : 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    }}
                  >
                    <i className={`fa-solid ${players[pId].icon}`}></i>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Side: Controls & Info */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Turn Indicator */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center shadow-sm">
              <h2 className="text-lg font-bold text-gray-700 mb-3">Giliran Bermain</h2>
              <div
                className={`text-xl font-bold px-6 py-2 rounded-xl inline-block transition-colors duration-300 shadow-sm ${currentPlayer === 1 ? 'text-blue-500 bg-blue-50 border-2 border-blue-200' : 'text-pink-500 bg-pink-50 border-2 border-pink-200'}`}
              >
                {currentPlayer === 1 ? 'Player 1 (Biru)' : 'Player 2 (Pink)'}
              </div>
            </div>

            {/* Dice Area */}
            <div className="flex flex-col items-center justify-center bg-pink-50/50 rounded-3xl p-8 border border-pink-50 shadow-sm">
              <div className={`text-6xl text-rose-600 mb-6 drop-shadow-md ${isRolling ? 'animate-spin' : ''}`}>
                <i className={`fa-solid ${getDiceIcon(diceNum)}`}></i>
              </div>
              <button
                onClick={rollDice}
                disabled={isMoving}
                className={`bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-10 rounded-full shadow-lg transform transition-all tracking-wide flex items-center gap-2 ${isMoving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
              >
                <i className="fa-solid fa-rotate"></i> Kocok Dadu
              </button>
              <p className="mt-4 text-md font-semibold text-gray-500 h-6">{rollText}</p>
            </div>

            {/* Event Log */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex-grow shadow-sm flex flex-col">
              <h3 className="font-bold text-gray-700 mb-2 border-b pb-2 flex items-center gap-2">
                <i className="fa-solid fa-list-ul text-pink-400"></i> Catatan Perjalanan
              </h3>
              <div className="text-sm text-gray-600 h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {logs.map((log) => (
                  <div key={log.id} dangerouslySetInnerHTML={{ __html: log.msg }} />
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            <div className="flex justify-between mt-auto">
              <button onClick={() => setShowRules(true)} className="text-sm text-pink-600 hover:text-pink-800 underline font-medium">
                Cara Bermain
              </button>
              <button onClick={resetGame} className="text-sm text-gray-500 hover:text-red-500 underline font-medium">
                Reset Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal (Question/Dare) */}
      {actionModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-[popIn_0.3s_ease-out]">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white text-center relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
                <div className="bg-pink-100 text-pink-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  <i className="fa-solid fa-heart"></i>
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-6">Deep Talk & Goals!</h2>
            </div>
            <div className="p-8 text-center">
              <div className="text-xs text-pink-600 font-bold mb-4 bg-pink-50 py-1.5 px-4 rounded-lg inline-block border border-pink-100 uppercase tracking-wider shadow-sm">
                <i className="fa-solid fa-microphone mr-1"></i> {asker} Bertanya kepada {answerer}
              </div>
              <div className="italic font-medium text-gray-700 text-lg mb-8">"{actionModal.text}"</div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAnswered}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-all w-full"
                >
                  Sudah Dijawab Jujur
                </button>
                <button onClick={handleSkip} className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-red-500 font-semibold py-2 px-8 rounded-full transition-all w-full text-sm border border-gray-200">
                  Tidak Menjawab (Mundur 3 Langkah)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Win Modal */}
      {showWin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden text-center animate-[popIn_0.3s_ease-out]">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-white relative overflow-hidden">
              <i className="fa-solid fa-crown text-6xl mb-4 text-yellow-100 drop-shadow-md relative z-10"></i>
              <h2 className="text-3xl font-bold relative z-10">SELAMAT!</h2>
            </div>
            <div className="p-8">
              <p className="text-xl text-gray-700 font-medium mb-6">{players[currentPlayer].name} Menang!</p>
              <p className="text-sm text-gray-500 mb-8">Sebagai hadiah, pihak yang kalah harus menuruti 1 permintaan dari pemenang saat ketemu nanti!</p>
              <button
                onClick={() => {
                  setShowWin(false)
                  resetGame()
                }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-all w-full"
              >
                Main Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-[popIn_0.2s_ease-out]">
            <div className="bg-pink-500 p-4 text-white text-center flex justify-between items-center">
              <h2 className="text-xl font-bold">Cara Bermain</h2>
              <button onClick={() => setShowRules(false)} className="text-white hover:text-pink-200">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-6 text-gray-700 space-y-3 text-sm">
              <p>1. Game ini dimainkan oleh 2 orang. (Bisa share screen atau saling lapor angka dadu).</p>
              <p>
                2. Tekan tombol <strong>Kocok Dadu</strong> secara bergantian.
              </p>
              <p>
                3. Jika mendarat di petak berlogo hati <i className="fa-solid fa-heart text-pink-400"></i>, akan muncul <strong>Pertanyaan Deep Talk / Mindset</strong>.
              </p>
              <p>
                4. <strong>Aturan Bertanya:</strong> Jika <span className="text-blue-500 font-bold">Player 1 (Biru)</span> yang mendarat, maka <span className="text-pink-500 font-bold">Player 2 (Pink)</span> yang bertanya, dan Player 1
                WAJIB menjawab.
              </p>
              <p>
                5. Jika menolak menjawab, pilih tombol <strong>"Tidak Menjawab"</strong>, risikonya <strong>mundur 3 langkah!</strong>
              </p>
              <p>
                6. Tangga <i className="fa-solid fa-arrow-up text-green-500"></i> membawa naik, Ular <i className="fa-solid fa-arrow-down text-red-500"></i> membawa turun.
              </p>
              <p>7. Yang pertama mencapai angka 100 menang!</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
    </div>
  )
}
