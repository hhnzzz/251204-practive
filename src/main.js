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

  const summaryProblem = document.getElementById('summaryProblem')
  const summaryCard = document.getElementById('summaryCard')

  // 구글 폼으로 보낼 숨겨진 필드들
  const gfStudentNumber = document.getElementById('gf_studentNumber')
  const gfStudentName = document.getElementById('gf_studentName')
  const gfProblemText = document.getElementById('gf_problemText')
  const gfInventionCard = document.getElementById('gf_inventionCard')
  const gfIdeaText = document.getElementById('gf_ideaText')

  const googleForm = document.getElementById('googleForm')
  const submitBtn = document.getElementById('submitBtn')
  const postSubmitMessage = document.getElementById('postSubmitMessage')

  // 발명 카드 종류
  const inventionCards = [
    '더하기',
    '빼기',
    '모양 바꾸기',
    '크게 또는 작게',
    '반대로 생각하기',
    '자연물 본뜨기',
    '용도 바꾸기',
    '재료 바꾸기',
    '남의 아이디어 빌리기',
    '폐품 활용하기',
  ]

  let currentCard = ''

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

  // 발명 카드 뽑기
  function drawRandomCard() {
    const randomIndex = Math.floor(Math.random() * inventionCards.length)
    currentCard = inventionCards[randomIndex]
    cardDisplay.textContent = `오늘의 발명 카드: "${currentCard}"`
    redrawCardBtn.disabled = false
    toStep4Btn.disabled = false

    // 드라마틱한 카드 연출
    cardDisplay.classList.remove('card-animate')
    void cardDisplay.offsetWidth // reflow to restart animation
    cardDisplay.classList.add('card-animate')
  }

  if (drawCardBtn) {
    drawCardBtn.addEventListener('click', drawRandomCard)
  }

  if (redrawCardBtn) {
    redrawCardBtn.addEventListener('click', drawRandomCard)
  }

  // 아이디어 텍스트가 바뀔 때마다 구글 폼 숨김 필드에도 반영
  if (ideaTextInput) {
    ideaTextInput.addEventListener('input', () => {
      gfIdeaText.value = ideaTextInput.value.trim()
    })
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
