import './style.css'

// 바닐라 JS로 단계 전환과 데이터 전달을 처리합니다.
// DOM이 완전히 로드된 후에 실행되도록 보장
document.addEventListener('DOMContentLoaded', () => {
  initApp()
})

function initApp() {
  const steps = Array.from(document.querySelectorAll('.step'))
  let currentStepIndex = 0

  const studentNumberInput = document.getElementById('studentNumber')
  const studentNameInput = document.getElementById('studentName')
  const problemTextInput = document.getElementById('problemText')
  const ideaTextInput = document.getElementById('ideaText')

  const cardDisplay = document.getElementById('inventionCardDisplay')
  const drawCardBtn = document.getElementById('drawCardBtn')
  const redrawCardBtn = document.getElementById('redrawCardBtn')
  const toStep4Btn = document.getElementById('toStep4Btn')
  const gachaSlot = document.getElementById('gachaSlot')
  const gachaResult = document.getElementById('gachaResult')

  const summaryProblem = document.getElementById('summaryProblem')
  const summaryCard = document.getElementById('summaryCard')

  // 구글 폼으로 보낼 숨겨진 필드들
  const gfStudentNumber = document.getElementById('gf_studentNumber')
  const gfStudentName = document.getElementById('gf_studentName')
  const gfProblemText = document.getElementById('gf_problemText')
  const gfInventionCard = document.getElementById('gf_inventionCard')
  const gfIdeaText = document.getElementById('gf_ideaText')
  const gfSketchImage = document.getElementById('gf_sketchImage')

  const googleForm = document.getElementById('googleForm')
  const submitBtn = document.getElementById('submitBtn')
  const postSubmitMessage = document.getElementById('postSubmitMessage')

  // 발명 카드 종류
  const inventionCards = [
    '1. 더하기',
    '2. 빼기',
    '3. 모양 바꾸기',
    '4. 크게 또는 작게',
    '5. 반대로 생각하기',
    '6. 자연물 본뜨기',
    '7. 용도 바꾸기',
    '8. 재료 바꾸기',
    '9. 남의 아이디어 빌리기',
    '10. 폐품 활용하기',
  ]

  let currentCard = ''
  let isGachaSpinning = false

  function showStep(index) {
    steps.forEach((step, i) => {
      if (i === index) {
        step.classList.add('step-active')
      } else {
        step.classList.remove('step-active')
      }
    })
    currentStepIndex = index

    // 4단계에 들어갈 때, 요약 상자와 구글 폼 숨김 필드 값을 갱신
    if (index === 3) {
      const problem = problemTextInput.value.trim()
      const card = currentCard || '아직 카드를 뽑지 않았어요.'

      summaryProblem.textContent = problem || '아직 작성한 내용이 없어요.'
      summaryCard.textContent = card

      gfStudentNumber.value = studentNumberInput.value.trim()
      gfStudentName.value = studentNameInput.value.trim()
      gfProblemText.value = problem
      gfInventionCard.value = card
      gfIdeaText.value = ideaTextInput.value.trim()
    }
  }

  // 이전/다음 버튼 처리
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (currentStepIndex < steps.length - 1) {
        showStep(currentStepIndex + 1)
      }
    })
  })

  document.querySelectorAll('[data-prev]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (currentStepIndex > 0) {
        showStep(currentStepIndex - 1)
      }
    })
  })

  // 가챠 슬롯 머신 초기화
  function initGachaSlot() {
    if (!gachaSlot) return
    gachaSlot.innerHTML = ''
    gachaSlot.style.transform = 'translateY(0)'
    gachaSlot.style.transition = 'none'
    // 카드를 여러 번 복제해서 무한 스크롤 효과
    for (let i = 0; i < 5; i++) {
      inventionCards.forEach((card) => {
        const item = document.createElement('div')
        item.className = 'gacha-card-item'
        item.textContent = card
        gachaSlot.appendChild(item)
      })
    }
  }

  // 발명 카드 뽑기 (가챠 효과)
  function drawRandomCard() {
    if (isGachaSpinning) return

    isGachaSpinning = true
    drawCardBtn.disabled = true
    redrawCardBtn.disabled = true
    toStep4Btn.disabled = true

    // 슬롯 머신 시작
    gachaSlot.classList.add('spinning')
    gachaResult.classList.remove('show')
    cardDisplay.textContent = ''

    // 랜덤 카드 선택
    const randomIndex = Math.floor(Math.random() * inventionCards.length)
    currentCard = inventionCards[randomIndex]

    // 1.5~2.5초 후 멈춤
    const spinDuration = 1500 + Math.random() * 1000

    // 스핀 애니메이션 시작
    let spinOffset = 0
    const spinInterval = setInterval(() => {
      spinOffset -= 80
      gachaSlot.style.transform = `translateY(${spinOffset}px)`
    }, 50)

    setTimeout(() => {
      clearInterval(spinInterval)
      
      // 슬롯 멈춤
      gachaSlot.classList.remove('spinning')
      
      // 선택된 카드로 슬롯 위치 조정 (중앙 정렬)
      const targetIndex = randomIndex + inventionCards.length * 2 // 세 번째 세트에서 선택
      const targetPosition = -(targetIndex * 80)
      gachaSlot.style.transform = `translateY(${targetPosition}px)`
      gachaSlot.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'

      // 결과 표시
      setTimeout(() => {
        cardDisplay.textContent = `오늘의 발명 카드: "${currentCard}"`
        gachaResult.classList.add('show')
        
        // 드라마틱한 카드 연출
        cardDisplay.classList.remove('card-animate')
        void cardDisplay.offsetWidth
        cardDisplay.classList.add('card-animate')

        isGachaSpinning = false
        drawCardBtn.disabled = false
        redrawCardBtn.disabled = false
        toStep4Btn.disabled = false
      }, 500)
    }, spinDuration)
  }

  if (drawCardBtn) {
    drawCardBtn.addEventListener('click', drawRandomCard)
  }

  if (redrawCardBtn) {
    redrawCardBtn.addEventListener('click', () => {
      initGachaSlot()
      drawRandomCard()
    })
  }

  // 가챠 슬롯 초기화
  initGachaSlot()

  // 아이디어 텍스트가 바뀔 때마다 구글 폼 숨김 필드에도 반영
  if (ideaTextInput) {
    ideaTextInput.addEventListener('input', () => {
      gfIdeaText.value = ideaTextInput.value.trim()
    })
  }

  // 그림판 기능 초기화
  const sketchCanvas = document.getElementById('sketchCanvas')
  const sketchColorInput = document.getElementById('sketchColor')
  const sketchSizeInput = document.getElementById('sketchSize')
  const sketchSizeLabel = document.getElementById('sketchSizeLabel')
  const clearSketchBtn = document.getElementById('clearSketch')
  const sketchToolBtns = document.querySelectorAll('.sketch-tool-btn')

  let isDrawing = false
  let currentTool = 'pen'
  let ctx = null

  if (sketchCanvas) {
    ctx = sketchCanvas.getContext('2d')
    
    // 캔버스 크기 조정 (반응형)
    function resizeCanvas() {
      const container = sketchCanvas.parentElement
      const maxWidth = container.clientWidth - 20
      const aspectRatio = 600 / 400
      sketchCanvas.style.width = `${maxWidth}px`
      sketchCanvas.style.height = `${maxWidth / aspectRatio}px`
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 그리기 시작
    function startDrawing(e) {
      isDrawing = true
      const rect = sketchCanvas.getBoundingClientRect()
      const scaleX = sketchCanvas.width / rect.width
      const scaleY = sketchCanvas.height / rect.height
      
      const x = (e.clientX || e.touches[0].clientX) - rect.left
      const y = (e.clientY || e.touches[0].clientY) - rect.top
      
      ctx.beginPath()
      ctx.moveTo(x * scaleX, y * scaleY)
      saveSketchToForm()
    }

    // 그리기 중
    function draw(e) {
      if (!isDrawing) return
      e.preventDefault()
      
      const rect = sketchCanvas.getBoundingClientRect()
      const scaleX = sketchCanvas.width / rect.width
      const scaleY = sketchCanvas.height / rect.height
      
      const x = (e.clientX || e.touches[0].clientX) - rect.left
      const y = (e.clientY || e.touches[0].clientY) - rect.top
      
      if (currentTool === 'pen') {
        ctx.strokeStyle = sketchColorInput.value
        ctx.lineWidth = parseInt(sketchSizeInput.value)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = parseInt(sketchSizeInput.value) * 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
      
      ctx.lineTo(x * scaleX, y * scaleY)
      ctx.stroke()
      saveSketchToForm()
    }

    // 그리기 종료
    function stopDrawing() {
      if (isDrawing) {
        isDrawing = false
        saveSketchToForm()
      }
    }

    // 마우스 이벤트
    sketchCanvas.addEventListener('mousedown', startDrawing)
    sketchCanvas.addEventListener('mousemove', draw)
    sketchCanvas.addEventListener('mouseup', stopDrawing)
    sketchCanvas.addEventListener('mouseout', stopDrawing)

    // 터치 이벤트
    sketchCanvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      startDrawing(e)
    })
    sketchCanvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      draw(e)
    })
    sketchCanvas.addEventListener('touchend', stopDrawing)
    sketchCanvas.addEventListener('touchcancel', stopDrawing)

    // 선 두께 표시 업데이트
    if (sketchSizeInput && sketchSizeLabel) {
      sketchSizeInput.addEventListener('input', () => {
        sketchSizeLabel.textContent = `${sketchSizeInput.value}px`
      })
    }

    // 도구 선택
    sketchToolBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sketchToolBtns.forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        currentTool = btn.dataset.tool
      })
    })

    // 전체 지우기
    if (clearSketchBtn) {
      clearSketchBtn.addEventListener('click', () => {
        if (confirm('그림을 모두 지우시겠어요?')) {
          ctx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height)
          saveSketchToForm()
        }
      })
    }

    // 그림을 base64로 변환하여 폼에 저장
    function saveSketchToForm() {
      if (gfSketchImage && sketchCanvas) {
        const dataURL = sketchCanvas.toDataURL('image/png')
        gfSketchImage.value = dataURL
      }
    }
  }

  // 구글 폼 전송 (fetch + no-cors)
  if (googleForm) {
    googleForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      e.stopPropagation()

      const formUrl = googleForm.action
      const num = studentNumberInput.value.trim()
      const name = studentNameInput.value.trim()
      const problem = problemTextInput.value.trim()
      const idea = ideaTextInput.value.trim()
      const card = currentCard

      // 숨겨진 필드 동기화
      gfStudentNumber.value = num
      gfStudentName.value = name
      gfProblemText.value = problem
      gfIdeaText.value = idea
      gfInventionCard.value = card

      const formData = new FormData()
      formData.set('entry.670944922', num) // 번호
      formData.set('entry.260370643', name) // 이름
      formData.set('entry.1436421567', problem) // 불편했던 경험
      formData.set('entry.399385104', idea) // 아이디어
      formData.set('inventionCard', card) // 참고용

      try {
        await fetch(formUrl, {
          method: 'POST',
          mode: 'no-cors', // 요청은 보내지지만 응답은 Opaque
          body: formData,
        })
        if (submitBtn) {
          submitBtn.disabled = true
          submitBtn.textContent = '전송 완료!'
        }
        if (postSubmitMessage) {
          postSubmitMessage.classList.remove('hidden')
        }
        alert('선생님께 잘 제출되었습니다!')
      } catch (err) {
        console.error(err)
        alert('전송 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
      }
    })
  }

  // 첫 화면 표시
  showStep(0)
} // initApp 함수 종료
