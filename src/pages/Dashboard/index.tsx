import React, { useState, useEffect, FormEvent } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from "react-router-dom";
import api from '../../services/api'

import logoImg from '../../assets/logo.svg'

import { Title, Text, Form, Repositories, Error } from './styles'

interface Repository {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState('')
  const [newRepository, setNewRepository] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>(() => {

    const storegedReposirories = localStorage.getItem('@githubExplorer:repositories')

    if (storegedReposirories) {
      return JSON.parse(storegedReposirories)
    } else {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('@githubExplorer:repositories', JSON.stringify(repositories))
  }, [repositories])

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()

    if (!newRepository) {
      setInputError('Digite o autor/nome do repositório.')
      return
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepository}`)

      const repository = response.data

      setRepositories([...repositories, repository])
      setNewRepository('')
      setInputError('')
    } catch (err) {
      setInputError('Erro na busca por este repositório.')
    }

  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer"></img>
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepository}
          onChange={e => setNewRepository(e.target.value)}
          placeholder="Digite o nome do repositório."
        />
        <button type="submit" >Pesquisar</button>
      </Form>
      {inputError && <Error> {inputError} </Error>}
      <Text>Ex.: Facebook/react.</Text>

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  )
}

export default Dashboard
