<template>
  <v-conteiner>
    <v-row aling="center" justify="center" class="ma-3 rounded">
      <v-col cols="3">
        <expansions_Panel colorIcon="warning" icon="mdi-cash-clock">
          <template v-slot:contentTitle>
            <p>Pagamentos Pendentes</p>
          </template>
          <template v-slot:content>
            <tableView>
              <template v-slot:contentTHead>
                <th>Nome</th>
                <th>Data de vencimento</th>
              </template>
              <template v-slot:contentTr>
                <tbody v-for="nameIndex in payments" :key="nameIndex">
                  <tr v-if="nameIndex.status === 'pending'">
                    <td>{{ nameIndex.students_id.users_id.name }}</td>
                    <td>{{ nameIndex.due_date }}</td>
                  </tr>
                </tbody>
              </template>
            </tableView>
          </template>
        </expansions_Panel>
      </v-col>
      <v-col cols="3">
        <expansions_Panel colorIcon="success" icon="mdi-cash-check">
          <template v-slot:contentTitle>
            <p>Pagamentos Vigentes</p>
          </template>
          <template v-slot:content>
            <tableView>
              <template v-slot:contentTHead>
                <th>Nome</th>
                <th>Data de vencimento</th>
              </template>
              <template v-slot:contentTr>
                <tbody v-for="nameIndex in payments" :key="nameIndex">
                  <tr v-if="nameIndex.status === 'paid'">
                    <td>{{ nameIndex.students_id.users_id.name }}</td>
                    <td>{{ nameIndex.due_date }}</td>
                  </tr>
                </tbody>
              </template>
            </tableView>
          </template>
        </expansions_Panel>
      </v-col>

      <v-col cols="3  ">
        <expansions_Panel colorIcon="error" icon="mdi-cash-remove">
          <template v-slot:contentTitle>
            <p>Pagamentos Vencidos</p>
          </template>
          <template v-slot:content>
            <tableView >
              <template v-slot:contentTHead>
                <th >nome</th>
                <th>Data de vencimento</th>
              </template>
              <template v-slot:contentTr>
                <tbody v-for="nameIndex in payments" :key="nameIndex">
                  <tr v-if="nameIndex.status === 'overdue'">
                    <td>{{ nameIndex.students_id.users_id.name }}</td>
                    <td>{{ nameIndex.due_date }}</td>
                  </tr>
                </tbody>
              </template>
            </tableView>
          </template>
        </expansions_Panel>





      </v-col>

    </v-row>
  </v-conteiner>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import {getPayments as getPaymentApi} from '@/services/user.js'
import {  onMounted, computed } from 'vue'

const userStore = useUserStore();




onMounted(()=>{
  fethPayment()
})


const fethPayment = async()=>{
  try {
    const response = await getPaymentApi()
    userStore.getPayment(response)
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

const payments = computed(()=>userStore.payments)


</script>
