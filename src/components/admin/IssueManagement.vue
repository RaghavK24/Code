<template>
    <div class="row justify-content-center">
      <div class="col-8">
        <div class="card">
          <div class="card-header m-0 p-0">
            <div class="row col-12 d-flex justify-content-between align-items-center m-auto my-2">
              <div class="col-auto">
                <span class="text-center fs-6 fw-bold mt-3">Current Issues</span>
              </div>
              <div class="col-6 d-inline-flex justify-content-end m-auto me-0">
                <div class="col-auto mx-2">
                  <button class="btn btn-sm btn-secondary mx-2" @click="refresh1">
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
              <div v-if="issues1.length > 0">
                <table class="table table-responsive">
                  <thead class="table-light border-bottom table-hover align-items-center">
                    <tr>
                      <th scope="col" class="fw-bold">ID</th>
                      <th scope="col" class="fw-bold">USERNAME</th>
                      <th scope="col" class="fw-bold">BOOK</th>
                      <th scope="col" class="fw-bold">SECTION</th>
                      <th scope="col" class="fw-bold">STATUS</th>
                      <th scope="col" class="fw-bold">DATE ISSUED</th>
                      <th scope="col" class="fw-bold">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="issue in issues1" :key="issue.id" class="align-middle">
                      <td>{{ issue.id }}</td>
                      <td>{{ issue.username }}</td>
                      <td>{{ issue.book.name }}</td>
                      <td>{{ issue.book.section_name }}</td>
                      <td>{{ issue.status }}</td>
                      <td>{{ issue.issue_date }}</td>
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
                                  @click="revokeIssue(issue)"
                                >
                                  <mdicon name="check-circle" class="text-success me-2" :size="20" />
                                  Revoke
                                </a></b>
                            </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>No Issues to show!</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <pre>{{ issues }}</pre> -->
    </div>
  
    <div class="row justify-content-center">
        <div class="col-8">
          <div class="card">
            <div class="card-header m-0 p-0">
              <div class="row col-12 d-flex justify-content-between align-items-center m-auto my-2">
                <div class="col-auto">
                  <span class="text-center fs-6 fw-bold mt-3">Previous Issues</span>
                </div>
                <div class="col-6 d-inline-flex justify-content-end m-auto me-0">
                  <div class="col-auto mx-2">
                    <button class="btn btn-sm btn-secondary mx-2" @click="refresh2">
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
                <div v-if="issues2.length > 0">
                  <table class="table table-responsive">
                    <thead class="table-light border-bottom table-hover align-items-center">
                      <tr>
                        <th scope="col" class="fw-bold">ID</th>
                        <th scope="col" class="fw-bold">USERNAME</th>
                        <th scope="col" class="fw-bold">BOOK</th>
                        <th scope="col" class="fw-bold">SECTION</th>
                        <th scope="col" class="fw-bold">STATUS</th>
                        <th scope="col" class="fw-bold">DATE ISSUED</th>
                        <th scope="col" class="fw-bold">DATE REVOKED</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="issue in issues2" :key="issue.id" class="align-middle">
                        <td>{{ issue.id }}</td>
                        <td>{{ issue.username }}</td>
                        <td>{{ issue.book.name }}</td>
                        <td>{{ issue.book.section_name }}</td>
                        <td>{{ issue.status }}</td>
                        <td>{{ issue.issue_date }}</td>
                        <td>{{ issue.return_date }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else>No Issues to show!</div>
              </div>
            </div>
          </div>
        </div>

      </div>
</template>
 <script setup>
  import { ref } from 'vue'
  import axiosClient from '@/js/axios.js'
  import LoadingIndicator from '@/components/LoadingIndicator.vue'
  
  const issues1 = ref([])
  const issues2 = ref([])
  const main_loading = ref(true)
  

  
  async function fetchIssues1() {
    console.log('Fetching Issues...')
    main_loading.value = true
    try {
      const res = await axiosClient.get('/api/issue/status/1')
      console.log(res.data)
      issues1.value = res.data
    } catch (err) {
      console.log(err)
    } finally {
      main_loading.value = false
    }
  }
  async function fetchIssues2() {
    console.log('Fetching Issues...')
    main_loading.value = true
    try {
      const res = await axiosClient.get('/api/issue/status/2')
      console.log(res.data)
      issues2.value = res.data
    } catch (err) {
      console.log(err)
    } finally {
      main_loading.value = false
    }
  }
  
  
  const refresh1 = async () => {
    console.log('Refreshing Issues...')
    await fetchIssues1()
  }
  const refresh2 = async () => {
    console.log('Refreshing Issues...')
    await fetchIssues2()
  }


  
  // const showIssue = (issue) => {
  //   console.log('show issue details')
  // }
  
  const revokeIssue = async (issue) => {
    console.log('approved issue')
    const formData = new FormData()
    // formData.append('issue_id', issue.id)
    // formData.append('approved', !!approved)
    formData.append('user_id', issue.user_id)
    formData.append('book_id', issue.book_id)
  
    try {
      main_loading.value = true
      await axiosClient.put(`api/issue/${issue.user_id}/${issue.book_id}`)
    } catch (err) {
      console.log(err)
    } finally {
      main_loading.value = false
    }
  
    await fetchIssues1()
    await fetchIssues2()
  }
  
  
  

  
  await fetchIssues1()
  await fetchIssues2()
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
  