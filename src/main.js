import './style.css'

// 바닐라 JS로 단계 전환과 데이터 전달을 처리합니다.
// DOM이 완전히 로드된 후에 실행되도록 보장
document.addEventListener('DOMContentLoaded', () => {
  initApp()
})

function initApp() {
  let currentLevel = null
  let currentStep = 'level-select'
  let l2_currentCard = ''
  let l2_isGachaSpinning = false

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

  // 레벨 선택 이벤트 리스너 추가
  document.querySelectorAll('.level-card').forEach((card) => {
    card.addEventListener('click', () => {
      currentLevel = card.dataset.level
      showStep(`level${currentLevel}-1`)
    })
  })

  // 레벨 선택으로 돌아가기
  document.querySelectorAll('[data-back-to-select]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showStep('level-select')
      currentLevel = null
    })
  })

  // 단계 전환 함수
  function showStep(stepName) {
    document.querySelectorAll('.step').forEach((step) => {
      step.classList.remove('step-active')
    })
    const targetStep = document.querySelector(`[data-step="${stepName}"]`)
    if (targetStep) {
      targetStep.classList.add('step-active')
      currentStep = stepName

      // Level 2-4 진입 시 요약 업데이트
      if (stepName === 'level2-4') {
        const problem = document.getElementById('l2_problemText')?.value.trim()
        const card = l2_currentCard || '아직 카드를 뽑지 않았어요.'
        const summaryProblem = document.getElementById('l2_summaryProblem')
        const summaryCard = document.getElementById('l2_summaryCard')
        if (summaryProblem) summaryProblem.textContent = problem || '아직 작성한 내용이 없어요.'
        if (summaryCard) summaryCard.textContent = card
      }
    }
  }

  // 다음 버튼 처리
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const currentStepEl = document.querySelector('.step-active')
      if (!currentStepEl) return
      
      const steps = Array.from(document.querySelectorAll(`[data-level="${currentLevel}"]`))
      const currentIndex = steps.indexOf(currentStepEl)
      if (currentIndex < steps.length - 1) {
        showStep(steps[currentIndex + 1].dataset.step)
      }
    })
  })

  // 이전 버튼 처리
  document.querySelectorAll('[data-prev]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const currentStepEl = document.querySelector('.step-active')
      if (!currentStepEl) return
      
      const steps = Array.from(document.querySelectorAll(`[data-level="${currentLevel}"]`))
      const currentIndex = steps.indexOf(currentStepEl)
      if (currentIndex > 0) {
        showStep(steps[currentIndex - 1].dataset.step)
      }
    })
  })

  // Level 2 가챠 초기화
  function initL2Gacha() {
    const gachaSlot = document.getElementById('l2_gachaSlot')
    if (!gachaSlot) return
    gachaSlot.innerHTML = ''
    gachaSlot.style.transform = 'translateY(0)'
    gachaSlot.style.transition = 'none'
    for (let i = 0; i < 5; i++) {
      inventionCards.forEach((card) => {
        const item = document.createElement('div')
        item.className = 'gacha-card-item'
        item.textContent = card
        gachaSlot.appendChild(item)
      })
    }
  }

  // Level 2 카드 뽑기
  function drawL2Card() {
    if (l2_isGachaSpinning) return
    l2_isGachaSpinning = true

    const gachaSlot = document.getElementById('l2_gachaSlot')
    const cardDisplay = document.getElementById('l2_inventionCardDisplay')
    const drawBtn = document.getElementById('l2_drawCardBtn')
    const redrawBtn = document.getElementById('l2_redrawCardBtn')
    const nextBtn = document.getElementById('l2_toNextBtn')

    if (!gachaSlot || !cardDisplay || !drawBtn) return

    drawBtn.disabled = true
    if (redrawBtn) redrawBtn.disabled = true
    if (nextBtn) nextBtn.disabled = true

    gachaSlot.classList.add('spinning')
    const gachaResult = document.getElementById('l2_gachaResult')
    if (gachaResult) gachaResult.classList.remove('show')
    cardDisplay.textContent = ''

    const randomIndex = Math.floor(Math.random() * inventionCards.length)
    l2_currentCard = inventionCards[randomIndex]
    const spinDuration = 1500 + Math.random() * 1000

    let spinOffset = 0
    const spinInterval = setInterval(() => {
      spinOffset -= 80
      gachaSlot.style.transform = `translateY(${spinOffset}px)`
    }, 50)

    setTimeout(() => {
      clearInterval(spinInterval)
      gachaSlot.classList.remove('spinning')
      const targetIndex = randomIndex + inventionCards.length * 2
      const targetPosition = -(targetIndex * 80)
      gachaSlot.style.transform = `translateY(${targetPosition}px)`
      gachaSlot.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'

      setTimeout(() => {
        cardDisplay.textContent = `오늘의 발명 카드: "${l2_currentCard}"`
        if (gachaResult) gachaResult.classList.add('show')
        cardDisplay.classList.remove('card-animate')
        void cardDisplay.offsetWidth
        cardDisplay.classList.add('card-animate')

        l2_isGachaSpinning = false
        drawBtn.disabled = false
        if (redrawBtn) redrawBtn.disabled = false
        if (nextBtn) nextBtn.disabled = false
      }, 500)
    }, spinDuration)
  }

  // Level 2 가챠 버튼 이벤트
  const l2DrawBtn = document.getElementById('l2_drawCardBtn')
  const l2RedrawBtn = document.getElementById('l2_redrawCardBtn')
  if (l2DrawBtn) {
    l2DrawBtn.addEventListener('click', drawL2Card)
  }
  if (l2RedrawBtn) {
    l2RedrawBtn.addEventListener('click', () => {
      initL2Gacha()
      drawL2Card()
    })
  }
  initL2Gacha()

  // 그림판 초기화 함수 (모든 레벨 공통)
  function initSketch(canvas, colorInput, sizeInput, sizeLabel, clearBtn, toolBtns, dataInput) {
    if (!canvas) return null

    const ctx = canvas.getContext('2d')
    let isDrawing = false
    let currentTool = 'pen'

    function resizeCanvas() {
      const container = canvas.parentElement
      const maxWidth = container.clientWidth - 20
      const aspectRatio = 600 / 400
      canvas.style.width = `${maxWidth}px`
      canvas.style.height = `${maxWidth / aspectRatio}px`
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    function startDrawing(e) {
      isDrawing = true
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX || e.touches[0].clientX) - rect.left
      const y = (e.clientY || e.touches[0].clientY) - rect.top
      ctx.beginPath()
      ctx.moveTo(x * scaleX, y * scaleY)
      saveSketch()
    }

    function draw(e) {
      if (!isDrawing) return
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX || e.touches[0].clientX) - rect.left
      const y = (e.clientY || e.touches[0].clientY) - rect.top

      if (currentTool === 'pen') {
        ctx.strokeStyle = colorInput.value
        ctx.lineWidth = parseInt(sizeInput.value)
      } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = parseInt(sizeInput.value) * 2
      }
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineTo(x * scaleX, y * scaleY)
      ctx.stroke()
      saveSketch()
    }

    function stopDrawing() {
      if (isDrawing) {
        isDrawing = false
        saveSketch()
      }
    }

    function saveSketch() {
      if (dataInput && canvas) {
        const dataURL = canvas.toDataURL('image/png')
        dataInput.value = dataURL
      }
    }

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseout', stopDrawing)
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      startDrawing(e)
    })
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      draw(e)
    })
    canvas.addEventListener('touchend', stopDrawing)
    canvas.addEventListener('touchcancel', stopDrawing)

    if (sizeInput && sizeLabel) {
      sizeInput.addEventListener('input', () => {
        sizeLabel.textContent = `${sizeInput.value}px`
      })
    }

    toolBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        toolBtns.forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        currentTool = btn.dataset.tool
      })
    })

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('그림을 모두 지우시겠어요?')) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          saveSketch()
        }
      })
    }

    return { saveSketch }
  }

  // 각 레벨별 그림판 초기화
  document.querySelectorAll('.sketch-container').forEach((container) => {
    const canvas = container.querySelector('.sketch-canvas')
    const colorInput = container.querySelector('.sketch-color')
    const sizeInput = container.querySelector('.sketch-size')
    const sizeLabel = container.querySelector('.sketch-size-label')
    const clearBtn = container.querySelector('.clear-sketch')
    const toolBtns = container.querySelectorAll('.sketch-tool-btn')
    const dataInput = container.parentElement.querySelector('.sketch-image-data')

    if (canvas) {
      initSketch(canvas, colorInput, sizeInput, sizeLabel, clearBtn, toolBtns, dataInput)
    }
  })

  // 제출 처리 함수
  async function submitLevel(level, data) {
    // 구글 폼 전송
    const form = document.getElementById('googleForm')
    if (form) {
      const formData = new FormData()
      
      // 레벨별 entry 번호 설정
      // ⚠️ 아래 entry 번호들을 실제 구글 폼의 entry 번호로 변경하세요!
      
      if (level === '1') {
        // Level 1 entry 번호 설정
        formData.set('entry.XXXXXXXXX', '1') // 레벨 (Level 1)
        if (data.number) formData.set('entry.1465581057', data.number) // 번호
        if (data.name) formData.set('entry.842649084', data.name) // 이름
        if (data.description) formData.set('entry.1925242', data.description) // 발명 설명
        // 그림은 아래에서 처리
      } else if (level === '2') {
        // Level 2 entry 번호 설정
        formData.set('entry.XXXXXXXXX', '2') // 레벨 (Level 2)
        if (data.number) formData.set('entry.670944922', data.number) // 번호
        if (data.name) formData.set('entry.260370643', data.name) // 이름
        if (data.problem) formData.set('entry.1436421567', data.problem) // 불편했던 경험
        if (data.card) formData.set('entry.XXXXXXXXX', data.card) // 발명 카드
        if (data.description) formData.set('entry.399385104', data.description) // 나만의 발명아이디어
        // 그림은 아래에서 처리
      } else if (level === '3') {
        // Level 3 entry 번호 설정
        formData.set('entry.XXXXXXXXX', '3') // 레벨 (Level 3)
        if (data.teamMembers) formData.set('entry.114543920', data.teamMembers) // 모둠원 입력
        if (data.description) formData.set('entry.1497466334', data.description) // 발명 설명
        // 그림은 아래에서 처리
      }

      // 그림 데이터
      if (data.sketch) {
        try {
          const base64Data = data.sketch.split(',')[1]
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'image/png' })
          const fileName = `발명_Level${level}_${data.name || data.teamMembers || '학생'}_${Date.now()}.png`
          const file = new File([blob], fileName, { type: 'image/png' })
          
          // 그림 파일 업로드 entry 번호 (레벨별로 다를 수 있음)
          if (level === '1') {
            formData.append('entry.781929115', file, fileName) // Level 1 그림 entry 번호
          } else if (level === '2') {
            formData.append('entry.1046076771', file, fileName) // Level 2 그림 entry 번호
          } else if (level === '3') {
            formData.append('entry.395333856', file, fileName) // Level 3 아이디어 스캐치
          }
        } catch (error) {
          console.error('그림 변환 오류:', error)
        }
      }

      try {
        await fetch(form.action, {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        })
      } catch (err) {
        console.error('구글 폼 전송 오류:', err)
      }
    }

    // 로컬 스토리지에 저장 (나중에 API로 교체 가능)
    const submissions = JSON.parse(localStorage.getItem(`submissions_level${level}`) || '[]')
    submissions.push({
      ...data,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem(`submissions_level${level}`, JSON.stringify(submissions))
    
    return true
  }

  // Level 1 제출
  document.getElementById('l1_submitBtn')?.addEventListener('click', async () => {
    const number = document.getElementById('l1_studentNumber')?.value.trim()
    const name = document.getElementById('l1_studentName')?.value.trim()
    const description = document.getElementById('l1_description')?.value.trim()
    const sketch = document.querySelector('[data-step="level1-2"] .sketch-image-data')?.value

    if (!number || !name || !description) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    const success = await submitLevel('1', { number, name, description, sketch })
    if (success) {
      showStep('level1-3')
      loadSubmissions('l1_submissions', '1')
    } else {
      alert('제출 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
    }
  })

  // Level 2 제출
  document.getElementById('l2_submitBtn')?.addEventListener('click', async () => {
    const number = document.getElementById('l2_studentNumber')?.value.trim()
    const name = document.getElementById('l2_studentName')?.value.trim()
    const problem = document.getElementById('l2_problemText')?.value.trim()
    const description = document.getElementById('l2_description')?.value.trim()
    const sketch = document.querySelector('[data-step="level2-4"] .sketch-image-data')?.value

    if (!number || !name || !problem || !description || !l2_currentCard) {
      alert('모든 항목을 입력하고 카드를 뽑아주세요.')
      return
    }

    const success = await submitLevel('2', { number, name, problem, card: l2_currentCard, description, sketch })
    if (success) {
      showStep('level2-5')
      loadSubmissions('l2_submissions', '2')
    } else {
      alert('제출 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
    }
  })

  // Level 3 제출
  document.getElementById('l3_submitBtn')?.addEventListener('click', async () => {
    const teamMembers = document.getElementById('l3_teamMembers')?.value.trim()
    const description = document.getElementById('l3_description')?.value.trim()
    const sketch = document.querySelector('[data-step="level3-3"] .sketch-image-data')?.value

    if (!teamMembers || !description) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    const success = await submitLevel('3', { teamMembers, description, sketch })
    if (success) {
      showStep('level3-4')
      loadSubmissions('l3_submissions', '3')
    } else {
      alert('제출 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
    }
  })

  // 다른 학생들 제출 내용 불러오기
  function loadSubmissions(containerId, level) {
    const container = document.getElementById(containerId)
    if (!container) return

    // 현재는 로컬 스토리지에서 불러오기 (나중에 API로 교체)
    const submissions = JSON.parse(localStorage.getItem(`submissions_level${level}`) || '[]')
    
    // 자신의 제출은 제외하고 표시
    const otherSubmissions = submissions.slice(0, -1).reverse() // 최신순, 자신 제외
    
    if (otherSubmissions.length === 0) {
      container.innerHTML = '<p class="no-submissions">아직 다른 친구들의 제출 내용이 없어요. 첫 번째가 되세요! 🎉</p>'
      return
    }

    container.innerHTML = otherSubmissions.map((sub, index) => {
      let content = `<div class="submission-item">
        <div class="submission-header">
          <span class="submission-number">#${index + 1}</span>`
      
      if (level === '1') {
        content += `<span class="submission-name">${sub.name || sub.number || '익명'}</span>`
      } else if (level === '2') {
        content += `<span class="submission-name">${sub.name || sub.number || '익명'}</span>`
        if (sub.card) {
          content += `<div class="submission-card">발명 카드: ${sub.card}</div>`
        }
      } else if (level === '3') {
        content += `<span class="submission-name">모둠: ${sub.teamMembers || '익명'}</span>`
      }
      
      content += `</div>`
      
      // 그림 표시
      if (sub.sketch) {
        content += `<div class="submission-sketch"><img src="${sub.sketch}" alt="발명 스케치" /></div>`
      }
      
      // 설명 표시
      if (sub.description) {
        content += `<div class="submission-description">${sub.description.replace(/\n/g, '<br>')}</div>`
      }
      
      // Level 2의 경우 불편했던 경험도 표시
      if (level === '2' && sub.problem) {
        content += `<div class="submission-problem"><strong>불편했던 경험:</strong> ${sub.problem}</div>`
      }
      
      content += `</div>`
      return content
    }).join('')
  }
}
