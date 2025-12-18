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

  // 숨김 입력 필드 추가 헬퍼 함수
  function addHiddenInput(form, name, value) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }

  // 레벨별 구글 폼 URL
  const googleFormUrls = {
    '1': 'https://docs.google.com/forms/d/e/1FAIpQLSccO-pVdGLv5VNT7XYUoUfCV0wmqMKeWyUZ296Br7fyhwiLhA/formResponse',
    '2': 'https://docs.google.com/forms/d/e/1FAIpQLSfVmtcR1Dvdh5MKjV8-nTIhdSG_IvfghoYWh956mOHny4w2pg/formResponse',
    '3': 'https://docs.google.com/forms/d/e/1FAIpQLScJ0UTVz-bWy4LDQT9WDlF9BHkGGNkiahrvgK7zGO2tMXyBkw/formResponse'
  }

  // 로컬 스토리지에 저장 (즉시 실행)
  function saveToLocalStorage(level, data) {
    try {
      const submissions = JSON.parse(localStorage.getItem(`submissions_level${level}`) || '[]')
      submissions.push({
        ...data,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem(`submissions_level${level}`, JSON.stringify(submissions))
      console.log(`Level ${level} 로컬 스토리지 저장 완료`)
      return true
    } catch (error) {
      console.error(`Level ${level} 로컬 스토리지 저장 오류:`, error)
      return false
    }
  }

  // 구글 폼 제출 (백그라운드에서 비동기 처리)
  function submitToGoogleForm(level, data) {
    const formUrl = googleFormUrls[level]
    if (!formUrl) {
      console.warn(`Level ${level}의 구글 폼 URL이 설정되지 않았습니다.`)
      return
    }

    console.log(`Level ${level} 구글 폼 제출 시작:`, data)

    // fetch 방식으로 제출 (사용자 요구사항에 맞춤)
    try {
      const params = new URLSearchParams()
      
      // 레벨별 entry 번호 설정
      if (level === '1') {
        // Level 1: 번호, 이름, 발명설명, 그림
        if (data.number) params.append('entry.1465581057', String(data.number))
        if (data.name) params.append('entry.842649084', String(data.name))
        if (data.description) params.append('entry.1925242', String(data.description))
        if (data.sketch) {
          // 이미지 데이터는 base64 문자열로 전송 (너무 길면 URL만 전송)
          const imageData = data.sketch.length > 100000 
            ? '[이미지 데이터가 너무 깁니다. 로컬 스토리지에서 확인하세요.]' 
            : data.sketch
          params.append('entry.781929115', imageData)
        }
      } else if (level === '2') {
        // Level 2: 번호, 이름, 불편한점, 아이디어설명, 그림
        if (data.number) params.append('entry.670944922', String(data.number))
        if (data.name) params.append('entry.260370643', String(data.name))
        if (data.problem) params.append('entry.1436421567', String(data.problem))
        if (data.description) params.append('entry.399385104', String(data.description))
        if (data.sketch) {
          const imageData = data.sketch.length > 100000 
            ? '[이미지 데이터가 너무 깁니다. 로컬 스토리지에서 확인하세요.]' 
            : data.sketch
          params.append('entry.1046076771', imageData)
        }
      } else if (level === '3') {
        // Level 3: 이름(모둠원), 아이디어설명, 그림
        if (data.teamMembers) params.append('entry.114543920', String(data.teamMembers))
        if (data.description) params.append('entry.1497466334', String(data.description))
        if (data.sketch) {
          const imageData = data.sketch.length > 100000 
            ? '[이미지 데이터가 너무 깁니다. 로컬 스토리지에서 확인하세요.]' 
            : data.sketch
          params.append('entry.395333856', imageData)
        }
      }

      // 제출 전 로그
      console.log(`Level ${level} 구글 폼 제출 데이터:`, {
        url: formUrl,
        params: Object.fromEntries(params)
      })

      // fetch로 제출
      fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }).then(() => {
        console.log(`Level ${level} 구글 폼 제출 완료 (fetch)`)
      }).catch((error) => {
        console.error(`Level ${level} 구글 폼 제출 오류 (fetch):`, error)
      })

      // 추가로 iframe 방식도 시도 (안정성 향상)
      setTimeout(() => {
        try {
          let iframe = document.getElementById('googleFormIframe')
          if (!iframe) {
            iframe = document.createElement('iframe')
            iframe.id = 'googleFormIframe'
            iframe.name = 'googleFormIframe'
            iframe.style.display = 'none'
            iframe.width = '0'
            iframe.height = '0'
            document.body.appendChild(iframe)
          }

          const existingForm = document.getElementById(`googleForm_${level}`)
          if (existingForm) {
            existingForm.remove()
          }

          const form = document.createElement('form')
          form.id = `googleForm_${level}`
          form.method = 'POST'
          form.action = formUrl
          form.target = 'googleFormIframe'
          form.enctype = 'application/x-www-form-urlencoded'
          form.style.display = 'none'
          document.body.appendChild(form)

          // 폼 필드 추가
          if (level === '1') {
            if (data.number) addHiddenInput(form, 'entry.1465581057', String(data.number))
            if (data.name) addHiddenInput(form, 'entry.842649084', String(data.name))
            if (data.description) addHiddenInput(form, 'entry.1925242', String(data.description))
            if (data.sketch && data.sketch.length <= 100000) {
              addHiddenInput(form, 'entry.781929115', data.sketch)
            }
          } else if (level === '2') {
            if (data.number) addHiddenInput(form, 'entry.670944922', String(data.number))
            if (data.name) addHiddenInput(form, 'entry.260370643', String(data.name))
            if (data.problem) addHiddenInput(form, 'entry.1436421567', String(data.problem))
            if (data.description) addHiddenInput(form, 'entry.399385104', String(data.description))
            if (data.sketch && data.sketch.length <= 100000) {
              addHiddenInput(form, 'entry.1046076771', data.sketch)
            }
          } else if (level === '3') {
            if (data.teamMembers) addHiddenInput(form, 'entry.114543920', String(data.teamMembers))
            if (data.description) addHiddenInput(form, 'entry.1497466334', String(data.description))
            if (data.sketch && data.sketch.length <= 100000) {
              addHiddenInput(form, 'entry.395333856', data.sketch)
            }
          }

          form.submit()
          console.log(`Level ${level} iframe 방식 제출 완료`)
        } catch (error) {
          console.error(`Level ${level} iframe 방식 제출 오류:`, error)
        }
      }, 300)
    } catch (error) {
      console.error(`Level ${level} 구글 폼 제출 오류:`, error)
    }
  }

  // 제출 처리 함수 (즉시 반환, 백그라운드에서 구글 폼 제출)
  function submitLevel(level, data) {
    // 1. 먼저 로컬 스토리지에 저장 (즉시)
    const saved = saveToLocalStorage(level, data)
    
    // 2. 백그라운드에서 구글 폼 제출 (비동기)
    submitToGoogleForm(level, data)
    
    return saved
  }

  // Level 1 제출
  document.getElementById('l1_submitBtn')?.addEventListener('click', () => {
    const number = document.getElementById('l1_studentNumber')?.value.trim()
    const name = document.getElementById('l1_studentName')?.value.trim()
    const description = document.getElementById('l1_description')?.value.trim()
    const sketch = document.querySelector('[data-step="level1-2"] .sketch-image-data')?.value

    if (!number || !name || !description) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    // 제출 처리 (즉시 실행)
    const success = submitLevel('1', { number, name, description, sketch })
    if (success) {
      // 즉시 화면 전환 및 내용 공유
      showStep('level1-3')
      loadSubmissions('l1_submissions', '1')
    } else {
      alert('제출 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
    }
  })

  // Level 2 제출
  document.getElementById('l2_submitBtn')?.addEventListener('click', () => {
    const number = document.getElementById('l2_studentNumber')?.value.trim()
    const name = document.getElementById('l2_studentName')?.value.trim()
    const problem = document.getElementById('l2_problemText')?.value.trim()
    const description = document.getElementById('l2_description')?.value.trim()
    const sketch = document.querySelector('[data-step="level2-4"] .sketch-image-data')?.value

    if (!number || !name || !problem || !description || !l2_currentCard) {
      alert('모든 항목을 입력하고 카드를 뽑아주세요.')
      return
    }

    // 제출 처리 (즉시 실행)
    const success = submitLevel('2', { number, name, problem, card: l2_currentCard, description, sketch })
    if (success) {
      // 즉시 화면 전환 및 내용 공유
      showStep('level2-5')
      loadSubmissions('l2_submissions', '2')
    } else {
      alert('제출 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
    }
  })

  // Level 3 제출
  document.getElementById('l3_submitBtn')?.addEventListener('click', () => {
    const teamMembers = document.getElementById('l3_teamMembers')?.value.trim()
    const description = document.getElementById('l3_description')?.value.trim()
    const sketch = document.querySelector('[data-step="level3-3"] .sketch-image-data')?.value

    if (!teamMembers || !description) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    // 제출 처리 (즉시 실행)
    const success = submitLevel('3', { teamMembers, description, sketch })
    if (success) {
      // 즉시 화면 전환 및 내용 공유
      showStep('level3-4')
      loadSubmissions('l3_submissions', '3')
    } else {
      alert('제출 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
    }
  })

  // 제출 내용 불러오기 (자신의 제출 포함)
  function loadSubmissions(containerId, level) {
    const container = document.getElementById(containerId)
    if (!container) return

    // 현재는 로컬 스토리지에서 불러오기 (나중에 API로 교체)
    const submissions = JSON.parse(localStorage.getItem(`submissions_level${level}`) || '[]')
    
    // 모든 제출을 최신순으로 표시 (자신의 제출 포함)
    const allSubmissions = [...submissions].reverse() // 최신순
    
    if (allSubmissions.length === 0) {
      container.innerHTML = '<p class="no-submissions">아직 제출 내용이 없어요. 첫 번째가 되세요! 🎉</p>'
      return
    }

    container.innerHTML = allSubmissions.map((sub, index) => {
      // 자신의 제출인지 확인 (가장 최신 제출이 자신의 것)
      const isMySubmission = index === 0
      let content = `<div class="submission-item ${isMySubmission ? 'my-submission' : ''}">
        <div class="submission-header">
          ${isMySubmission ? '<span class="my-badge">내 아이디어</span>' : ''}
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

