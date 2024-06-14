const loginContainer = document.querySelector('.login-container')
const layout = document.querySelector('#layout')
const departmentsContainer = document.querySelector('#departments')
const positionsContainer = document.querySelector('#positions')
let activePage
let activeMenuItem
const departmentModal = new bootstrap.Modal('#departmentModal', {
  keyboard: false
})
let departmentId
const positionModal = new bootstrap.Modal('#positionModal', {
  keyboard: false
})
let positionId
const departmentConfirmModal = new bootstrap.Modal('#departmentConfirmModal', {
  keyboard: false
})
const positionConfirmModal = new bootstrap.Modal('#positionConfirmModal', {
  keyboard: false
})

const api = axios.create({
  baseURL: 'http://176.96.241.114:3003/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

const toastSuccess = text => {
  Toastify({
    text,
    duration: 3000,
    style: {
      background: 'rgb(79,179,79)',
      borderRadius: '10px'
    }
  }).showToast()
}

const toastError = text => {
  Toastify({
    text,
    duration: 3000,
    style: {
      background: 'rgb(201,68,68)',
      borderRadius: '10px'
    }
  }).showToast()
}

const login = () => {
  const emailInput = document.querySelector('#email')
  const passwordInput = document.querySelector('#password')
  const email = emailInput.value
  const password = passwordInput.value

  console.log(email, password)

  api
    .post('/api/auth/login', {
      email,
      password
    })
    .then(res => {
      console.log(res.data)
      localStorage.setItem('token', res.data.access_token)
      toastSuccess('Xush kelibsiz!')
      window.location.reload()
    })
    .catch(e => {
      console.log(e)
      toastError('Login yoki parol notogri')
    })
}

const logout = () => {
  localStorage.clear()
  window.location.reload()
}

window.onload = () => {
  if (localStorage.getItem('token')) {
    loginContainer.style.display = 'none'

    activePage = document.querySelector('main .page:not(.d-none)')
    activeMenuItem = document.querySelector('nav .list-group-item.active')
    console.log(activePage)
    renderDepartments()
  } else {
    layout.style.display = 'none'
  }
  const departmentModal = document.getElementById('departmentModal')
  departmentModal.addEventListener('hidden.bs.modal', event => {
    const name = document.querySelector('#departmentName')
    const desc = document.querySelector('#departmentDesc')
    name.value = ''
    desc.value = ''
  })
  const departmentConfirmModal = document.getElementById(
    'departmentConfirmModal'
  )
  departmentConfirmModal.addEventListener('hidden.bs.modal', event => {
    departmentId = null
  })
  const positionModal = document.getElementById('positionModal')
  positionModal.addEventListener('hidden.bs.modal', event => {
    const name = document.querySelector('#positionName')
    const desc = document.querySelector('#positionDesc')
    name.value = ''
    desc.value = ''
  })
  const positionConfirmModal = document.getElementById('departmentConfirmModal')
  positionConfirmModal.addEventListener('hidden.bs.modal', event => {
    positionId = null
  })
}

const toggleMenu = () => {
  const nav = document.querySelector('nav')
  nav.classList.toggle('hide')
}

const openPage = (event, page) => {
  switch (page) {
    case 'departments':
      activePage.classList.add('d-none')
      departmentsContainer.classList.remove('d-none')
      activePage = departmentsContainer
      renderDepartments()
      break
    case 'positions':
      activePage.classList.add('d-none')
      positionsContainer.classList.remove('d-none')
      activePage = positionsContainer
      renderPositions()
      break
  }

  activeMenuItem.classList.remove('active')
  event.target.classList.add('active')
  // console.log(event.target);
  activeMenuItem = event.target
}

const renderDepartments = () => {
  const tbody = departmentsContainer.querySelector('#departments tbody')
  tbody.innerHTML = ''

  api
    .post('/api/department/find-many', {})
    .then(res => {
      console.log(res.data)
      res.data.data.map((d, index) => {
        tbody.innerHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${d.name}</td>
      <td>${d.description}</td>
      <td>
      <button class="btn" onclick="openDepartmentModal(${
        d.id
      })"><i class="fa-solid fa-pen-to-square fs-3"></i>
      <button class="btn btn-dark" onclick="openDepartmentConfirmModal(${
        d.id
      })">
      <i class="fas fa-trash" ></i>
      </button>
      </td>
   </tr>
  `
      })
    })
    .catch(e => {
      console.log(e)
    })
}
const renderPositions = () => {
  const tbodyp = positionsContainer.querySelector('#positions tbody')
  tbodyp.innerHTML = ''
  api
    .post('/api/position/find-many', {})
    .then(res => {
      console.log(res.data)
      res.data.data.map((d, index) => {
        tbodyp.innerHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${d.name}</td>
      <td>${d.description}</td>
      <td>
      <button class="btn" onclick="openPositionModal(${
        d.id
      })"><i class="fa-solid fa-pen-to-square fs-3"></i>
      <button class="btn btn-dark" onclick="openPositionConfirmModal(${d.id})">
      <i class="fas fa-trash" ></i>
      </button>
      </td>
   </tr>
  `
      })
    })
    .catch(e => {
      console.log(e)
    })
}

const openDepartmentModal = id => {
  departmentId = id
  departmentModal.show()
  if (departmentId) {
    const name = document.querySelector('#departmentName')
    const desc = document.querySelector('#departmentDesc')

    api.post('/api/department/find-first', { where: { id } }).then(res => {
      name.value = res.data.name
      desc.value = res.data.description
    })
  }
}

const openPositionModal = id => {
  positionId = id
  positionModal.show()
  if (departmentId) {
    const name = document.querySelector('#departmentName')
    const desc = document.querySelector('#departmentDesc')

    api.post('/api/department/find-first', { where: { id } }).then(res => {
      name.value = res.data.name
      desc.value = res.data.description
    })
  }
}

const saveDepartment = async () => {
  const name = document.querySelector('#departmentName')
  const desc = document.querySelector('#departmentDesc')
  try {
    if (departmentId) {
      await api.patch('/api/department/update', {
        data: { name: name.value, description: desc.value },
        where: { id: departmentId }
      })
      toastSuccess('Muafaqiyatli')
      departmentId = null
    } else {
      await api.post('/api/department/create', {
        data: { name: name.value, description: desc.value }
      })
      toastSuccess('Muafaqiyatli')
    }
    departmentModal.hide()
    renderDepartments()
  } catch (error) {
    console.log(error)
    toastError('Error')
  }
}

const savePosition = async () => {
  const namep = document.querySelector('#positionName')
  const descp = document.querySelector('#positionDesc')
  try {
    if (positionId) {
      await api.patch('/api/position/update', {
        data: { name: namep.value, description: descp.value },
        where: { id: positionId }
      })
      toastSuccess('Yaratildi')
      positionId = null
    } else {
      await api.post('/api/position/create', {
        data: { name: namep.value, description: descp.value }
      })
      toastSuccess('Yaratildi')
    }
    positionModal.hide()
    renderPositions()
  } catch (error) {
    console.log(error)
    toastError('Error')
  }
}

const openDepartmentConfirmModal = id => {
  departmentId = id
  departmentConfirmModal.show()
}
const openPositionConfirmModal = id => {
  positionId = id
  positionConfirmModal.show()
}

const removeDepartment = () => {
  api
    .post('/api/department/delete', {
      where: { id: departmentId }
    })
    .then(res => {
      toastSuccess('Ochirildi')
      departmentConfirmModal.hide()
      renderDepartments()
    })
    .catch(error => {
      console.log(error)
      toastError('Error')
    })
}
const removePosition = () => {
  api
    .post('/api/position/delete', {
      where: { id: positionId }
    })
    .then(res => {
      toastSuccess('Ochirildi')
      positionConfirmModal.hide()
      renderPositions()
    })
    .catch(error => {
      console.log(error)
      toastError('Error')
    })
}
