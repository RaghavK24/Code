<template>
    <!-- <h2 class="text-center">Your Cart</h2> -->
    <div class="card card-body col-md-8 col-lg-10 m-auto p-0">
      <div class="row col-12 justify-content-center m-auto p-0">
        <div v-if="issues1.length > 0" class="mt-3">
          <table class="table table-responsive table-nowrap text-center">
            <thead class="border-bottom table-light">
              <tr>
                    <th scope="col"><b>ID</b></th>
                    <th scope="col"><b>USERNAME</b></th>
                    <th scope="col"><b>BOOK</b></th>
                    <th scope="col"><b>SECTION</b></th>
                    <th scope="col"><b>STATUS</b></th>
                    <th scope="col"><b>DATE ISSUED</b></th>
                    <th scope="col"><b>ACTION</b></th>
                  </tr>
            </thead>
            <tbody>
                <tr v-for="issue in issues1" :key="issue.id" class="align-middle">
                    <td>{{ issue.id }}</td>
                    <td>{{ issue.username }}</td>
                    <td>{{ issue.book_name }}</td>
                    <td>{{ issue.section_name }}</td>
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
                                Return
                              </a></b>
                          </li>
                      </ul>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <div class="row justify-content-center align-items-center">
            <h2 class="text-center my-5">You have been issued no books!</h2>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axiosClient from '@/js/axios.js'
  
  const issues1 = ref([])

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




  
  // const showIssue = (issue) => {
  //   console.log('show issue details')
  // }
  
  const revokeIssue = async (issue) => {
  
    try {
      main_loading.value = true
      await axiosClient.put(`api/issue/${issue.user_id}/${issue.book_id}`)
    } catch (err) {
      console.log(err)
    } finally {
      main_loading.value = false
    }
  
    await fetchIssues1()
  }
  
  
  

  
  await fetchIssues1()

  
  
  </script>
  
  <style scoped></style>
  