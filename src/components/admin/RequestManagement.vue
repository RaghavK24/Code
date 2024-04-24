<template>
    <div class="row justify-content-center">
      <div class="col-8">
        <div class="card">
          <div class="card-header m-0 p-0">
            <div class="row col-12 d-flex justify-content-between align-items-center m-auto my-2">
              <div class="col-auto">
                <span class="text-center fs-6 fw-bold mt-3">Request Management</span>
              </div>
              <div class="col-6 d-inline-flex justify-content-end m-auto me-0">
                <div class="col-auto mx-2">
                  <button class="btn btn-sm btn-secondary mx-2" @click="refresh">
                    <mdicon name="refresh" class="text-white" :size="18" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body shadow-sm">
            <div v-if="main_loading">
              <loading-indicator></loading-indicator>
            </div>
            <div v-else>
              <div v-if="requests.length > 0">
                <table class="table table-responsive">
                  <thead class="table-light border-bottom table-hover align-items-center">
                    <tr>
                      <th scope="col" class="fw-bold">ID</th>
                      <th scope="col" class="fw-bold">USERNAME</th>
                      <th scope="col" class="fw-bold">BOOK</th>
                      <th scope="col" class="fw-bold">SECTION</th>
                      <th scope="col" class="fw-bold">STATUS</th>
                      <th scope="col" class="fw-bold">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="request in requests" :key="request.id" class="align-middle">
                      <td>{{ request.id }}</td>
                      <td>{{ request.username }}</td>
                      <td>{{ request.book.name }}</td>
                      <td>{{ request.book.section_name }}</td>
                      <td>{{ request.book_status }}</td>
                      <td>
                        <button
                          class="btn btn-link dropdown-toggle px-0"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <mdicon name="dots-horizontal" :width="24" :height="24" />
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                              <b><a
                                  class="dropdown-item d-flex align-items-center"
                                  href="javascript:void(0)"
                                  @click="approveRequest(request)"
                                >
                                  <mdicon name="check-circle" class="text-success me-2" :size="20" />
                                  Approve
                                </a></b>
                            </li>
                        </ul>
                        <button class="btn btn-link text-decoration-none px-0" aria-expanded="false">
                          <mdicon
                            name="close-circle"
                            class="text-danger"
                            :size="20"
                            @click="deleteRequest(request)"
                          />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>No Requests to show!</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <pre>{{ requests }}</pre> -->
    </div>
  
    <!-- Delete Modal -->
    <div class="modal fade" id="modalRequestDelete" role="dialog" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Request</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>This request will be denied. This action is irreversible</p>
            <p>Are you sure you want to do this?</p>
          </div>
          <div class="modal-footer">
            <button @click="modalRequestDelete" type="button" class="btn btn-danger">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span v-else>
                <mdicon name="delete" class="text-white me-1" :size="16" />
              </span>
              Delete
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              id="modalRequestDeleteClose"
              data-bs-dismiss="modal"
            >
              <mdicon name="window-close" class="text-white me-1" :size="18" />
              Cancel
            </button>
          </div>
          <div class="row d-flex justify-content-center" v-if="errordata.isError">
            <div class="col-11 text-center">
              <div class="alert alert-danger" role="alert">
                {{ errordata.msg }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axiosClient from '@/js/axios.js'
  import { Modal } from 'bootstrap'
  import LoadingIndicator from '@/components/LoadingIndicator.vue'
  
  const requests = ref([])
  const main_loading = ref(true)
  const loading = ref(false)
  const errordata = {
    isError: false,
    msg: ''
  }
  
  const current_user = ref('')
  const current_book = ref('')
  
  // let modal
  let modalDelete
  onMounted(() => {
    modalDelete = new Modal(document.getElementById('modalRequestDelete'), {
      keyboard: false
    })
  })
  
  async function fetchRequests() {
    console.log('Fetching Requests...')
    main_loading.value = true
    try {
      const res = await axiosClient.get('/api/request')
      console.log(res.data)
      requests.value = res.data
    } catch (err) {
      console.log(err)
    } finally {
      main_loading.value = false
    }
  }
  
  const refresh = async () => {
    console.log('Refreshing Requests...')
    await fetchRequests()
  }


  
  // const showRequest = (request) => {
  //   console.log('show request details')
  // }
  
  const approveRequest = async (request) => {
    console.log('approved request')
    const formData = new FormData()
    // formData.append('request_id', request.id)
    // formData.append('approved', !!approved)
    formData.append('user_id', request.user_id)
    formData.append('book_id', request.book_id)
  
    try {
      main_loading.value = true
      await axiosClient.post('/api/issue', formData)
      await axiosClient.delete(`api/request/${request.user_id}/${request.book_id}`)
    } catch (err) {
      console.log(err)
    } finally {
      main_loading.value = false
    }
  
    await fetchRequests()
  }
  
  // const revokeRequest = (request) => {
  //   console.log('reject request')
  // }
  
  const deleteRequest = (request) => {
    // console.log('delete request')
    current_user.value = request.user_id
    current_book.value = request.book_id
    errordata.isError = false
    errordata.msg = ''
    modalDelete.show()
  }
  
  const modalRequestDelete = async () => {
    console.log('modal: deleting request')
    errordata.isError = false
    errordata.msg = ''
    loading.value = true
  
    try {
      const resp = await axiosClient.delete(`api/request/${current_user.value}/${current_book.value}`)
      console.log(resp)
      console.log('modal:Closing modal')
      document.getElementById('modalRequestDeleteClose').click()
      fetchRequests()
    } catch (err) {
      console.log(err)
      ;(errordata.isError = true), (errordata.msg = err.response.data)
    } finally {
      loading.value = false
    }
  }
  
  await fetchRequests()
  </script>
  
  <style scoped>
  th {
    vertical-align: middle;
    border-bottom: 3px solid #485460;
    font-size: 12px, bold;
  }
  .dropdown-toggle::after {
    content: none;
  }
  </style>
  